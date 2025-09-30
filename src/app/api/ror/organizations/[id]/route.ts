import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy API route for ROR organization lookup
 * This solves CORS issues when making client-side requests to the ROR API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Remove the full URL if provided, we just need the ID
    const cleanId = id.replace('https://ror.org/', '')

    // Validate ROR ID format
    const rorIdPattern = /^0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$/
    if (!rorIdPattern.test(cleanId)) {
      return NextResponse.json(
        { error: 'Invalid ROR ID format' },
        { status: 400 }
      )
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(`https://api.ror.org/v2/organizations/${cleanId}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DataCite-Commons/1.0'
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json(
            { error: 'Organization not found' },
            { status: 404 }
          )
        }
        
        return NextResponse.json(
          { error: `ROR API returned ${response.status}: ${response.statusText}` },
          { status: response.status }
        )
      }

      const data = await response.json()

      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      })
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 408 }
        )
      }
      
      throw error
    }
  } catch (error) {
    console.error('Error proxying ROR request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}