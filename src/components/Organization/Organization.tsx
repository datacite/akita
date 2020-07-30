import React from 'react';
import { OrganizationMetadata, OrganizationMetadataRecord } from '../OrganizationMetadata/OrganizationMetadata';

export interface OrganizationRecord {
    metadata: OrganizationMetadataRecord;
}

type Props = {
    organization: OrganizationRecord;
    detailPage: boolean;
};


export const Organization: React.FunctionComponent<Props> = ({ organization, detailPage }) => {

    return (
        <OrganizationMetadata metadata={organization.metadata} linkToExternal={detailPage}></OrganizationMetadata>
    )
}