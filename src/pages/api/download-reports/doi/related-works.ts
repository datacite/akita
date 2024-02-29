import { NextApiRequest, NextApiResponse } from "next"
import { gql } from '@apollo/client';
import apolloClient from '../../../../utils/apolloClient'
import { stringify } from 'csv-stringify/sync'
import { Work } from 'src/data/types';
import { QueryData } from 'src/data/queries/doiQuery'

const QUERY = gql`
  query getRelatedWorksDoiQuery(
    $id: ID!
    $filterQuery: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
    $repositoryId: String
  ) {
    work(id: $id) {
      citations(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        nodes {
          ...WorkFragment
        }
      }
      references(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        nodes {
          ...WorkFragment
        }
      }
      parts(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        nodes {
          ...WorkFragment
        }
      }
      partOf(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        nodes {
          ...WorkFragment
        }
      }
      otherRelated(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
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


function addConnectionType(w: Work, connectionType: string) {
  return { ...w, connectionType: connectionType }
}



export default async function downloadReportsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const variables = req.query

  const { data } = await apolloClient.query<QueryData, typeof variables>({
    query: QUERY,
    variables: variables
  })


  const references = data.work.references?.nodes.map(w => addConnectionType(w, 'Reference')) || []
  const citations = data.work.citations?.nodes.map(w => addConnectionType(w, 'Citation')) || []
  const parts = data.work.parts?.nodes.map(w => addConnectionType(w, 'Part')) || []
  const partOf = data.work.partOf?.nodes.map(w => addConnectionType(w, 'Is Part Of')) || []
  const otherRelated = data.work.otherRelated?.nodes.map(w => addConnectionType(w, 'Other Relation')) || []

  const works = references.concat(citations, parts, partOf, otherRelated)
  const sortedData = works.sort((a, b) => b.publicationYear - a.publicationYear)

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
      { key: 'connectionType', header: 'Connection Type' }
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