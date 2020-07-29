import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col } from 'react-bootstrap'

import Error from "../Error/Error"
import { Organization, OrganizationRecord } from '../Organization/Organization';

type Props = {
    rorId: string;
};

interface OrganizationResult {
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

interface OrganizationQueryData {
    organization: OrganizationResult
}

interface OrganizationQueryVar {
    id: string;
}

export const ORGANIZATION_GQL = gql`
query getOrganizationQuery($id: ID!) {
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
        identifierType
        }
    }
}
`;


const OrganizationContainer: React.FunctionComponent<Props> = ({ rorId }) => {
    const [organization, setOrganization] = React.useState<OrganizationRecord>();

    const fullId = "https://ror.org/" + rorId;

    const { loading, error, data } = useQuery<OrganizationQueryData, OrganizationQueryVar>(
        ORGANIZATION_GQL,
        {
            errorPolicy: 'all',
            variables: {
                id: fullId
            }
        })


    React.useEffect(() => {

        if (data) {
            let organization = data.organization;
            let identifiers = organization.identifiers.filter(i => {
                return i.identifier != "";
            });

            let org: OrganizationRecord = {
                id: organization.id,
                name: organization.name,
                alternateNames: organization.alternateName,
                url: organization.url,
                countryName: organization.address.country,
                identifiers: identifiers,
            };

            setOrganization(org);
        }

    }, [data]);

    if (loading) return <p>Loading...</p>;

    if (error) {
        return <Error title="No Service" message="Unable to retrieve organization" />
    }

    if (!organization) {
        return <Error title="No Data" message="No organization data" />
    }

    const content = () => {
        return (
            <div className="col-md-9 panel-list" id="content">
                <div className="panel panel-transparent content-item">
                    <div className="panel-body">
                        <Organization organization={organization} detailPage={true}></Organization>
                    </div>
                    <br />
                </div>
            </div>
        )
    }

    return (
        <Row>
            {content()}
        </Row>
    )
}

export default OrganizationContainer
