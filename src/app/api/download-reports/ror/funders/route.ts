'user server'

import { type NextRequest } from 'next/server'
import { gql } from '@apollo/client';
import apolloClient from 'src/utils/apolloClient/apolloClient'
import { stringify } from 'csv-stringify/sync'

const QUERY = gql`
  query getFundersRorQuery(
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
    $cursor: String
    $filterQuery: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    organization(
      id: $id
      gridId: $gridId
      crossrefFunderId: $crossrefFunderId
    ) {
      works(
        first: 0
        after: $cursor
        query: $filterQuery
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        facetCount: 200
      ) {
        funders {
          id
          title
          count
        }
      }
    }
  }
`


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const variables = Object.fromEntries(searchParams)

  const { data } = await apolloClient.query({
    query: QUERY,
    variables: variables
  })


  const csv = stringify(data.organization.works.funders, {
    header: true,
    columns: [{ key: 'id', header: 'Funder ID' }, { key: 'title', header: 'Title' }, { key: 'count', header: 'Work Count' }]
  })


  try {
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="funders_${variables.id}.csv"`
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }
}
