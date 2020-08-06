import React from 'react'
import Link from 'next/link'
import { rorFromUrl } from '../../utils/helpers'

export interface OrganizationMetadataRecord {
    id: string
    name: string
    alternateNames: string[]
    url: string
    countryName: string
    identifiers: {
        identifier: string,
        identifierType: string
    }[]
}

type Props = {
    metadata: OrganizationMetadataRecord
    linkToExternal: boolean
}


export const OrganizationMetadata: React.FunctionComponent<Props> = ({ metadata, linkToExternal }) => {

    const titleLink = () => {
        if (!linkToExternal) {
            return (
                <Link href="/organization/[organization]" as={`/organization${rorFromUrl(metadata.id)}`}>
                    <a>{metadata.name}</a>
                </Link>
            )
        } else {
            return (
                <a target="_blank" rel="noreferrer" href={metadata.id}>
                    {metadata.name}
                </a>
            )
        }
    }

    return (
        <div key={metadata.id} className="panel panel-transparent content-item">
            <div className="panel-body">
                <h3 className="work">
                    {titleLink()}
                    {metadata.alternateNames.length > 0 &&
                        <small> ({metadata.alternateNames.join(", ")})</small>
                    }
                </h3>
                <p>Website: <a href={metadata.url}>{metadata.url}</a></p>
                <p>Country: {metadata.countryName}</p>
                <h4>Other Identifiers</h4>
                {metadata.identifiers.length > 0 &&
                    <ul className="ror-identifiers">
                        {metadata.identifiers.map(identifier => (
                            <li key={identifier.identifier}><strong>{identifier.identifierType}</strong>: {identifier.identifier}</li>
                        ))}
                    </ul>
                }
            </div>
        </div>
    )
}

export default OrganizationMetadata
