import React from 'react';
import Link from 'next/link'
import { rorFromUrl } from '../../utils/helpers'

export interface OrganizationRecord {
    id: string;
    name: string;
    alternateNames: string[];
    url: string;
    countryName: string;
    identifiers: {
        identifier: string,
        identifierType: string
    }[];
}

type Props = {
    organization: OrganizationRecord;
    detailPage: boolean;
};


export const Organization: React.FunctionComponent<Props> = ({ organization, detailPage }) => {


    const titleLink = () => {
        if (!detailPage) {
            return (
                <Link href="/organization/[organization]" as={`/organizations${encodeURIComponent(rorFromUrl(organization.id))}`}>
                    <a>{organization.name}</a>
                </Link>
            )
        } else {
            return (
                <a target="_blank" rel="noreferrer" href={organization.id}>
                    {organization.name}
                </a>
            )
        }
    }


    return (
        <div key={organization.id} className="panel panel-transparent content-item">
            <div className="panel-body">
                <h3 className="work">
                    {titleLink()}
                    {organization.alternateNames.length > 0 &&
                        <small> ({organization.alternateNames.join(", ")})</small>
                    }
                </h3>
                <p>Website: <a href={organization.url}>{organization.url}</a></p>
                <p>Country: {organization.countryName}</p>
                <h4>Other Identifiers</h4>
                {organization.identifiers.length > 0 &&
                    <ul className="ror-identifiers">
                        {organization.identifiers.map(identifier => (
                            <li key={identifier.identifier}><strong>{identifier.identifierType}</strong>: {identifier.identifier}</li>
                        ))}
                    </ul>
                }
            </div>
        </div>
    )
}