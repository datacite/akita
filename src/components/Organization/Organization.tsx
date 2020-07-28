import React from 'react';

export interface OrganizationRecord {
    id: string;
    name: string;
}

type Props = {
    organization: OrganizationRecord;
};


export const Organization: React.FunctionComponent<Props> = ({ organization }) => {
    return (
        <div key={organization.id} className="panel panel-transparent content-item">
            <div className="panel-body">
                {organization.name}
            </div>
        </div>
    )
}