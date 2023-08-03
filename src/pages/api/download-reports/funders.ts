import { NextApiRequest, NextApiResponse } from "next"
import { gql } from '@apollo/client';
import apolloClient from '../../../utils/apolloClient'
import { Facet } from "src/components/FacetList/FacetList";

const QUERY = gql`
  query getOrganizationQuery(
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
        first: 200
        after: $cursor
        query: $filterQuery
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
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

const SEP = '\t'
function formatLine(f: Facet) {
  return `${f.id}${SEP}${f.title}${SEP}${f.count}`
}

function formatResults(data: Facet[]) {
  const header = `Funder ID${SEP}Title${SEP}Work count\n`
  return header + [ ...data ]
    .map(formatLine)
    .join('\n')
}


export default async function downloadReportsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const variables = req.query

  const { data } = await apolloClient.query({
    query: QUERY,
    variables: variables
  });
	
	res.setHeader('Content-Disposition', `attachment; filename="funders_${variables.id}.csv"`)
  return res.status(200).json(formatResults(data.organization.works.funders))
}