import React from 'react'
import FacetList from '../FacetList/Server'
import { Facet } from 'src/data/types'

type Props = {
    authors: Facet[]
    title: string
    model: string
    url: string
}

const AuthorsFacet: React.FunctionComponent<Props> = ({
    authors,
    title,
    model,
    url
}) => {
    if (!authors || authors.length === 0) return null

    // Used for checking filter shouldnt show author that is already filtered
    function checkAuthorForPerson(author) {
        // Only works on person model
        if (model == 'person') {
            const orcid_id = url.substring(11, url.length - 2)
            if (!author.id.includes(orcid_id)) {
                return author
            }
        } else {
            return author
        }
    }

    function removeNullAuthors(author) {
        if (author.title)
            return author
    }

    function generateValue (facetId: string) {
        return `creators_and_contributors.nameIdentifiers.nameIdentifier:"${facetId}"`
    }

    return (
        <FacetList
            data={authors.filter(removeNullAuthors).filter(checkAuthorForPerson)}
            title={title}
            id="authors-facets"
            value={generateValue}
            param="filterQuery"
            url={url}
            tooltipText={`This list includes only ${title} with ORCID iDs in DOI metadata.`}
        />
    )
}

export default AuthorsFacet
