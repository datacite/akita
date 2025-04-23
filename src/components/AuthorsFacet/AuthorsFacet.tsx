import React from 'react'
import FacetList from 'src/components/FacetList/FacetList'
import { Facet } from 'src/data/types'

type Props = {
    authors: Facet[]
    title: string
    model: string
    url: string
}

export default function AuthorsFacet({
    authors,
    title,
    model,
    url
}: Props) {
    if (!authors || authors.length === 0) return null

    // Used for checking filter shouldnt show author that is already filtered
    function checkAuthorForPerson(author: Facet) {
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

    function removeNullAuthors(author: Facet) {
        if (author.title)
            return author
    }

    function extractOrcid(input: string) {
        const orcidRegex = /\b(\d{4}-\d{4}-\d{4}-\d{3}[0-9X])\b/;
        const match = input.match(orcidRegex);
        return match ? match[1] : input;
    }

    return (
        <FacetList
            data={authors.filter(removeNullAuthors).filter(checkAuthorForPerson)}
            title={title}
            id="authors-facets"
            value={id => extractOrcid(id)}
            param="contributor"
            url={url}
            tooltipText={`This list includes only ${title} with ORCID iDs in DOI metadata.`}
        />
    )
}
