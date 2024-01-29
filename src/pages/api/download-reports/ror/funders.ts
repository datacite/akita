import { NextApiRequest, NextApiResponse } from "next"
import { gql } from '@apollo/client';
import apolloClient from '../../../../utils/apolloClient'
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


export default async function downloadReportsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const variables = req.query

  const { data } = await apolloClient.query({
    query: QUERY,
    variables: variables
  })
  
	
  const csv = stringify(data.organization.works.funders, {
    header: true,
    columns: [ { key: 'id', header: 'Funder ID' }, { key: 'title', header: 'Title' }, { key: 'count', header: 'Work Count' } ]
  })


  try {
    res.status(200)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="funders_${variables.id}.csv"`)
    res.send(csv)
  } catch (error) {
    res.status(400).json({ error })
  }
}