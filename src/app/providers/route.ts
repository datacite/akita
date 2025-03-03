import { NextResponse } from 'next/server'
import { DATACITE_API_URL } from 'src/data/constants'

interface RelatedProviderInfo {
  symbol: string
  memberType: string
}

interface RelatedProviderResponse {
  data: RelatedProviderInfo
  error?: any
}

function extractProviderData(provider: any): RelatedProviderInfo {
  return provider?.attributes ? {
    symbol: provider.attributes.symbol,
    memberType: provider.attributes.memberType,
  } : {
    symbol: "",
    memberType: ""
  }
}

export async function GET() {
  try {
    const options = {
      method: 'GET',
      headers: { accept: 'application/vnd.api+json' }
    }

    const searchParams = new URLSearchParams({
      'page[size]': '1000',
      query: "ror_id:*",
      'fields[provider]': 'symbol,memberType'
    })

    const res = await fetch(
      `${DATACITE_API_URL}/providers?${searchParams.toString()}`,
      options
    )

    if (!res.ok) {
      throw new Error(`DataCite API returned ${res.status}`)
    }

    const json = await res.json()

    // Create a map of ROR ID to provider info
    const providersMap: Record<string, RelatedProviderResponse> = {}
    json.data.forEach((provider: any) => {
      const rorId = provider.attributes.rorId
      providersMap[rorId] = {
        data: extractProviderData(provider)
      }
    })

    return NextResponse.json(providersMap, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}
