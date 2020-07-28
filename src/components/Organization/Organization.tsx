import React from 'react';
import Link from 'next/link'
import { rorFromUrl } from '../../utils/helpers'

export interface OrganizationRecord {
    id: string;
    name: string;
    type: string;
    url: string;
    identifiers: [{
        identifier: string,
        identifierType: string
    }];
}

type Props = {
    organization: OrganizationRecord;
    linkToDetailPage: boolean;
};


export const Organization: React.FunctionComponent<Props> = ({ organization, linkToDetailPage }) => {


    const titleLink = () => {
        console.log(linkToDetailPage);
        if (linkToDetailPage) {
            return (
                <Link href="/organizations/[organization]" as={`/organizations${encodeURIComponent(rorFromUrl(organization.id))}`}>
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
                </h3>
                <p>Website: {organization.url}</p>
                <p>Type: {organization.type}</p>
            </div>
        </div>
    )
}