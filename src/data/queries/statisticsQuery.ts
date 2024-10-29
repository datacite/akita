import { gql, useQuery } from '@apollo/client'


export function useStatisticsQuery() {
  const { loading, data, error } = useQuery<QueryData>(
    STATISTICS_QUERY,
    {
      errorPolicy: 'all'
    }
  )

  return { loading, data, error }
}


export const STATISTICS_QUERY = gql`
  query getStatsQuery {
    total: works {
      totalCount
      totalCountFromCrossref
      registrationAgencies {
        title
        count
      }
    }
    cited: works(hasCitations: 1) {
      totalCount
      registrationAgencies {
        title
        count
      }
    }
    claimed: works(hasPerson: true) {
      totalCount
      registrationAgencies {
        title
        count
      }
    }
    connected: works(
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasMember: true
    ) {
      totalCount
      registrationAgencies {
        title
        count
      }
    }
    people {
      totalCount
      years {
        title
        count
      }
    }
    organizations {
      totalCount
      years {
        title
        count
      }
    }
    publications: works(resourceTypeId: "Text") {
      totalCount
      published {
        title
        count
      }
    }
    citedPublications: works(resourceTypeId: "Text", hasCitations: 1) {
      totalCount
      published {
        title
        count
      }
    }
    claimedPublications: works(resourceTypeId: "Text", hasPerson: true) {
      totalCount
      published {
        title
        count
      }
    }
    connectedPublications: works(
      resourceTypeId: "Text"
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasMember: true
    ) {
      totalCount
      published {
        title
        count
      }
    }
    datasets: works(resourceTypeId: "Dataset") {
      totalCount
      published {
        title
        count
      }
    }
    citedDatasets: works(resourceTypeId: "Dataset", hasCitations: 1) {
      totalCount
      published {
        title
        count
      }
    }
    claimedDatasets: works(resourceTypeId: "Dataset", hasPerson: true) {
      totalCount
      published {
        title
        count
      }
    }
    connectedDatasets: works(
      resourceTypeId: "Dataset"
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasMember: true
    ) {
      totalCount
      published {
        title
        count
      }
    }
    softwares: works(resourceTypeId: "Software") {
      totalCount
      published {
        title
        count
      }
    }
    citedSoftwares: works(resourceTypeId: "Software", hasCitations: 1) {
      totalCount
      published {
        title
        count
      }
    }
    claimedSoftwares: works(resourceTypeId: "Software", hasPerson: true) {
      totalCount
      published {
        title
        count
      }
    }
    connectedSoftwares: works(
      resourceTypeId: "Software"
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasMember: true
    ) {
      totalCount
      published {
        title
        count
      }
    }
  }
`

export type QueryData = any
