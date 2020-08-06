import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Alert } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'

import Error from "../Error/Error"
import Pager from "../Pager/Pager"
import { Organization, OrganizationRecord } from '../Organization/Organization'
import { OrganizationMetadataRecord } from '../OrganizationMetadata/OrganizationMetadata'
import { DoiType } from '../DoiContainer/DoiContainer'
import DoiMetadata from '../DoiMetadata/DoiMetadata'

type Props = {
    rorId: string
}

interface OrganizationResult {
    id: string
    name: string
    alternateName: string[]
    url: string
    address: {
        country: string
    }
    identifiers: [{
        identifier: string,
        identifierType: string
    }]
    works: Works
}

interface Works {
    totalCount: number
    resourceTypes: ContentFacet[]
    pageInfo: PageInfo
    published: ContentFacet[]
    nodes: DoiType[]
}

interface ContentFacet {
    id: string
    title: string
    count: number
}

interface PageInfo {
    endCursor: string
    hasNextPage: boolean
}

interface OrganizationQueryData {
    organization: OrganizationResult
}

interface OrganizationQueryVar {
    id: string
    cursor: string
}

export const ORGANIZATION_GQL = gql`
query getOrganizationQuery($id: ID!, $cursor: String) {
    organization(id: $id) {
        id,
        name,
        alternateName,
        url,
        address {
        country
        },
        identifiers {
            identifier,
            identifierType,
        },
        works(first: 25, after: $cursor) {
            totalCount
            pageInfo {
              endCursor
              hasNextPage
            }
            resourceTypes {
              title
              count
            }
            published {
              title
              count
            }
            nodes {
              doi
              id
              titles{
                title
              }
              types{
                resourceTypeGeneral
                resourceType
              }
              creators {
                id
                name
                givenName
                familyName
              }
              version
              publicationYear
              publisher
              descriptions {
                description
              }
              rights {
                rights
                rightsUri
                rightsIdentifier
              }
              fieldsOfScience {
                id
                name
              }
              language {
                id
                name
              }
              registrationAgency {
                id
                name
              }
              registered
              rights {
                rights
              }
              citationCount
              viewCount
              downloadCount
            }
        }
    }
}
`

const OrganizationContainer: React.FunctionComponent<Props> = ({ rorId }) => {
    const [cursor] = useQueryState('cursor', { history: 'push' })
    const [organization, setOrganization] = React.useState<OrganizationRecord>()

    const fullId = "https://ror.org/" + rorId

    const { loading, error, data } = useQuery<OrganizationQueryData, OrganizationQueryVar>(
        ORGANIZATION_GQL,
        {
            errorPolicy: 'all',
            variables: {
                id: fullId,
                cursor: cursor
            }
        })

    React.useEffect(() => {
        if (data) {
            let organization = data.organization
            let identifiers = organization.identifiers.filter(i => {
                return i.identifier != ""
            })

            let orgMetadata: OrganizationMetadataRecord = {
                id: organization.id,
                name: organization.name,
                alternateNames: organization.alternateName,
                url: organization.url,
                countryName: organization.address.country,
                identifiers: identifiers,
            }

            setOrganization({
                metadata: orgMetadata
            })
        }

    }, [data])

    if (loading) return <p>Loading...</p>

    if (error) {
        return <Error title="No Service" message="Unable to retrieve organization" />
    }

    if (!organization) {
        return <Error title="No Data" message="No organization data" />
    }

    const relatedContent = () => {
        const hasNextPage = data.organization.works.pageInfo ? data.organization.works.pageInfo.hasNextPage : false
        const endCursor = data.organization.works.pageInfo ? data.organization.works.pageInfo.endCursor : ""

        if (!data.organization.works.totalCount) return (
            <React.Fragment>
                <Alert bsStyle="warning">No content found.</Alert>
            </React.Fragment>
        )

        return (
            <div>
                {data.organization.works.totalCount > 1 &&
                    <h3 className="member-results">{data.organization.works.totalCount.toLocaleString('en-US')} Works</h3>
                }

                {data.organization.works.nodes.map(doi => (
                    <React.Fragment key={doi.id}>
                        <DoiMetadata metadata={doi} />
                    </React.Fragment>
                ))}

                <Pager url={'/organization/' + rorId + '/?'} hasNextPage={hasNextPage} endCursor={endCursor} />
            </div>
        )
    }

    const leftSideBar = () => {

        return (
            <div className="col-md-3 hidden-xs hidden-sm">
                <div className="panel panel-transparent">
                    <div className="panel-body">
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const content = () => {
        return (
            <div className="col-md-9 panel-list" id="content">
                <div className="panel panel-transparent content-item">
                    <div className="panel-body">
                        <h2 className="member-results">Organization</h2>
                        <Organization organization={organization} />

                        {relatedContent()}
                    </div>
                    <br />
                </div>
            </div>
        )
    }

    return (
        <Row>
            {leftSideBar()}
            {content()}
        </Row>
    )
}

export default OrganizationContainer
