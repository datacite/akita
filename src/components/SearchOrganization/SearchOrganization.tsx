import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Alert } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'
import Pager from "../Pager/Pager"
import Error from "../Error/Error"
import { Organization, OrganizationRecord } from '../Organization/Organization';
import { OrganizationMetadataRecord } from '../OrganizationMetadata/OrganizationMetadata';

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
  query getOrganizationQuery(
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
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [searchResults, setSearchResults] = React.useState<OrganizationRecord[]>([]);

  const { loading, error, data, refetch } = useQuery<OrganizationsQueryData, OrganizationsQueryVar>(
    ORGANIZATIONS_GQL,
    {
      errorPolicy: 'all',
      variables: {
        query: searchQuery, cursor: cursor
      }
    })


  React.useEffect(() => {
    refetch({ query: searchQuery, cursor: cursor });

    const results: OrganizationRecord[] = [];

    if (data) {

      data.organizations.edges.map(edge => {
        // Filter out any empty identifiers
        let identifiers = edge.node.identifiers.filter(i => {
          return i.identifier != "";
        });

        let orgMetadata: OrganizationMetadataRecord = {
          id: edge.node.id,
          name: edge.node.name,
          alternateNames: edge.node.alternateName,
          url: edge.node.url,
          countryName: edge.node.address.country,
          identifiers: identifiers,
        };

        results.push({
          metadata: orgMetadata
        });

        return results;
      })

      setSearchResults(results);
    }

  }, [searchQuery, data, refetch]);

  const renderResults = () => {

    if (!loading && searchResults.length == 0) return (
      <React.Fragment>
        <Alert bsStyle="warning">
          No content found.
        </Alert>
      </React.Fragment>
    )

    if (error) return <Error title="Something went wrong." message="Unable to load services." />;

    if (!data) return '';

    const hasNextPage = data.organizations.pageInfo ? data.organizations.pageInfo.hasNextPage : false
    const endCursor = data.organizations.pageInfo ? data.organizations.pageInfo.endCursor : ""

    return (
      <div className="col-md-9 panel-list" id="content">
        <div className="panel panel-transparent content-item">
          <div className="panel-body">
            {searchResults.length > 1 &&
              <h3 className="member-results">{data.organizations.totalCount.toLocaleString('en-US')} Results</h3>
            }

            <ul>
              {searchResults.map(item => (
                <React.Fragment key={item.metadata.id}>
                  <Organization organization={item} detailPage={false}></Organization>
                </React.Fragment>
              ))}
            </ul>

            <Pager url={'/?'} hasNextPage={hasNextPage} endCursor={endCursor}></Pager>

          </div>
        </div>
      </div>
    )
  }

  const renderFacets = () => {

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit">Filters</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Row>
      {renderFacets()}
      {renderResults()}
    </Row>
  )
}

export default SearchOrganizations
