import { NextApiRequest, NextApiResponse } from "next"
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { WorkType } from "../../doi.org/[...doi]";

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
        nodes {
          ...WorkFragment
        }
      }
    }
  }
  fragment WorkFragment on Work {
    formattedCitation(style: "apa", locale: "en-US")
    publicationYear
  }
`

// const DEFAULT_VARIABLES = {
//   gridId: undefined,
//   crossrefFunderId: undefined,
//   cursor: null,
//   filterQuery: null,
//   published: null,
//   resourceTypeId: null,
//   fieldOfScience: null,
//   language: null,
//   license: null,
//   registrationAgency: null
// }

function formatResults(data: Pick<WorkType, 'formattedCitation' | 'publicationYear'>[]) {
  return [ ...data ]
    .sort((a, b) => b.publicationYear - a.publicationYear)
    .map(d => d.formattedCitation)
    .join('\n')
}


export default async function downloadReportsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const variables = req.query

  // const client = new ApolloClient({
  //   uri: 'https://api.datacite.org/graphql',
  //   cache: new InMemoryCache()
  // });

  // const { data } = await client.query({
  //   query: QUERY,
  //   variables: variables
  // });
  // console.log(formatResults(data.organization.works.nodes))
	
	// res.setHeader('Content-Disposition',  `attachment; filename="funders_${variables.id}.txt"`)
  return res.status(200)
}