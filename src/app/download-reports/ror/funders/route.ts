import { type NextRequest } from 'next/server'
import { stringify } from 'csv-stringify/sync'
import { fetchDoisFacets } from 'src/data/queries/searchDoiFacetsQuery';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const variables = Object.fromEntries(searchParams)

  const response = await fetchDoisFacets(variables, ['funders'])
  const works = response.data.works

  const csv = stringify(works.funders, {
    header: true,
    columns: [{ key: 'id', header: 'Funder ID' }, { key: 'title', header: 'Title' }, { key: 'count', header: 'Work Count' }]
  })

  try {
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="funders_${variables.rorId}.csv"`
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }
}
