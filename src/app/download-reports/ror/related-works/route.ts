import { type NextRequest } from 'next/server'
import { stringify } from 'csv-stringify/sync'
import { fetchDois, fetchDoisCitations } from 'src/data/queries/searchDoiQuery';


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const variables = Object.fromEntries(searchParams)

  const [responseWorks, citations] = await Promise.all([
    fetchDois(variables, 200),
    fetchDoisCitations(variables, 200),
  ]);

  const works = responseWorks.data.works.nodes.map((work, index) => ({ ...work, formattedCitation: citations[index] }));


  const sortedData = [...works].sort((a, b) => b.publicationYear - a.publicationYear)

  const csv = stringify(sortedData, {
    header: true,
    columns: [
      { key: 'titles[0].title', header: 'Title' },
      { key: 'publicationYear', header: 'Publication Year' },
      { key: 'doi', header: 'DOI' },
      { key: 'descriptions[0].description', header: 'Description' },
      { key: 'formattedCitation', header: 'Formatted Citation' },
      { key: 'types.resourceTypeGeneral', header: 'Resource Type (General)' },
      { key: 'types.resourceType', header: 'Resource Type' },
      // { key: '???', header: 'Connection Type(s)' }
    ]
  })

  try {
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="related-works_${variables.id}.csv"`
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }
}
