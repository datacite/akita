import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col } from 'react-bootstrap'

import Error from "../Error/Error"
import { Organization, OrganizationRecord } from '../Organization/Organization';

type Props = {
  searchQuery: string;
};

interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

interface OrganizationsNode {
  id: string;
  name: string;
  alternateName: string[];
  url: string;
  address: {
    country: string
  }
  identifiers: [{
    identifier: string,
    identifierType: string
  }];
}

interface OrganizationsEdge {
  node: OrganizationsNode
}

interface OrganizationsQueryVar {
  query: string;
  cursor: string;
}

interface OrganizationsQueryData {
  organizations: {
    totalCount: number;
    pageInfo: PageInfo;
    edges: OrganizationsEdge[];
  },
}

export const ORGANIZATIONS_GQL = gql`
  query getContentQuery(
    $query: String,
    $cursor: String,
    ) {
    organizations(query: $query, after: $cursor) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id,
          name,
          alternateName,
          url,
          address {
            country
          },
          identifiers {
            identifier,
            identifierType
          }
        }
      }
    }
  }
`;

const SearchOrganizations: React.FunctionComponent<Props> = ({ searchQuery }) => {
  const [searchResults, setSearchResults] = React.useState<OrganizationRecord[]>([]);

  const { loading, error, data, refetch } = useQuery<OrganizationsQueryData, OrganizationsQueryVar>(
    ORGANIZATIONS_GQL,
    {
      errorPolicy: 'all',
      variables: {
        query: searchQuery, cursor: ''
      }
    })


  React.useEffect(() => {
    refetch({ query: searchQuery, cursor: '' });

    const results: OrganizationRecord[] = [];

    if (data) {

      data.organizations.edges.map(edge => {
        // Filter out any empty identifiers
        let identifiers = edge.node.identifiers.filter(i => {
          return i.identifier != "";
        });

        let org: OrganizationRecord = {
          id: edge.node.id,
          name: edge.node.name,
          alternateNames: edge.node.alternateName,
          url: edge.node.url,
          countryName: edge.node.address.country,
          identifiers: identifiers,
        };

        results.push(org);

        return results;
      })

      setSearchResults(results);
    }

  }, [searchQuery, data, refetch]);

  const renderResults = () => {
    if (loading) return <p>Loading...</p>;

    if (error) return <Error title="Something went wrong." message="Unable to load services." />;

    if (!data) return '';

    return (
      <div>
        {searchResults.length > 1 &&
          <h3 className="member-results">{data.organizations.totalCount.toLocaleString('en-US')} Results</h3>
        }

        <ul>
          {searchResults.map(item => (
            <React.Fragment key={item.id}>
              <Organization organization={item} detailPage={false}></Organization>
            </React.Fragment>
          ))}
        </ul>
      </div>
    )
  }


  return (
    <Row>
      <Col>{renderResults()}</Col>
    </Row>
  )
}

export default SearchOrganizations
