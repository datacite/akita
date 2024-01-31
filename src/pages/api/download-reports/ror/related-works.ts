import { NextApiRequest, NextApiResponse } from "next"
import { gql } from '@apollo/client';
import apolloClient from '../../../../utils/apolloClient'
import { stringify } from 'csv-stringify/sync'

const QUERY = gql`
  query relatedWorksRorQuery(
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
    types {
      resourceTypeGeneral
      resourceType
    }
    doi
    formattedCitation(style: "apa", locale: "en-US", format: text)
    publicationYear
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

  const sortedData = [...data.organization.works.nodes].sort((a, b) => b.publicationYear - a.publicationYear)

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
    res.status(200)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="related-works_${variables.id}.csv"`)
    res.send(csv)
  } catch (error) {
    res.status(400).json({ error })
  }

}