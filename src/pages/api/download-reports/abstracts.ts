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
    titles {
      title
    }
    descriptions {
      description
      descriptionType
    }
    doi
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

const SEP = '\t'
function formatLine(w: Pick<WorkType, 'titles' | 'descriptions' | 'doi' | 'publicationYear'>) {
  return `${w.titles[0] ? w.titles[0].title : ''}${SEP}${w.publicationYear}${SEP}${w.doi}${SEP}${w.descriptions[0] ? w.descriptions[0].description : ''}`
}

function formatResults(data: Pick<WorkType, 'titles' | 'descriptions' | 'doi' | 'publicationYear'>[]) {
  const header = `Title${SEP}Publication Year${SEP}DOI${SEP}Description\n`
  return header + [ ...data ]
    .sort((a, b) => b.publicationYear - a.publicationYear)
    .map(formatLine)
    .join('\n')
}


export default async function downloadReportsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const variables = req.query

  const client = new ApolloClient({
    uri: 'https://api.datacite.org/graphql',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: QUERY,
    variables: variables
  });
  console.log(formatResults(data.organization.works.nodes))
	
	res.setHeader('Content-Disposition',  `attachment; filename="abstracts_${variables.id}.csv"`)
  return res.status(200).json(formatResults(data.organization.works.nodes))
}