import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy API route for ROR organization search
 * This solves CORS issues when making client-side requests to the ROR API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Build the query parameters for the ROR API
    const rorSearchParams = new URLSearchParams()
    
    // Pass through common search parameters
    const query = searchParams.get('query')
    if (query) {
      rorSearchParams.append('query', query)
    }
    
    const page = searchParams.get('page')
    if (page && Number(page) > 0) {
      rorSearchParams.append('page', page)
    }
    
    // Handle filter parameters
    const filter = searchParams.get('filter')
    if (filter) {
      rorSearchParams.append('filter', filter)
    }
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const url = `https://api.ror.org/v2/organizations${rorSearchParams.toString() ? '?' + rorSearchParams.toString() : ''}`
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DataCite-Commons/1.0'
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(
          { error: `ROR API returned ${response.status}: ${response.statusText}` },
          { status: response.status }
        )
      }

      const data = await response.json()

      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
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
    console.error('Error proxying ROR search request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}