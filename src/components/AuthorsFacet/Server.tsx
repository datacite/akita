import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Tooltip } from 'react-bootstrap'
import OverlayTrigger from '../OverlayTrigger/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSquare,
    faCheckSquare,
    faQuestionCircle
} from '@fortawesome/free-regular-svg-icons'

type Props = {
    authors: Facet[]
    title: string
    model: string
    url: string
}

interface Facet {
    id: string
    title: string
    count: number
}

const AuthorsFacet: React.FunctionComponent<Props> = ({
    authors,
    title,
    model,
    url
}) => {
    // const router = useRouter()

    // get current query parameters from next router
    const searchParams = useSearchParams()

    function facetLink(param: string, value: string, id: string) {
        let icon = faSquare

        const params = new URLSearchParams(Array.from(searchParams?.entries() || []));

        // delete model and cursor parameters
        params.delete(model)
        params.delete('cursor')

        if (params.get(param) == value) {
            // if param is present, delete from query and use checked icon
            params.delete(param)
            icon = faCheckSquare
        } else {
            // otherwise replace param with new value and use unchecked icon
            params.set(param, value)
        }

        return (
            <Link href={url + params.toString()} id={id}>
                <FontAwesomeIcon icon={icon} />{' '}
            </Link>
        )
    }

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

    return (
        <React.Fragment>
            {authors && authors.length > 0 && (
                <div className="panel facets add">
                    <div className="panel-body">
                        <OverlayTrigger 
                            placement="top"
                            overlay={
                                <Tooltip id="tooltipAuthors">
                                    This list includes only {title} with ORCID iDs in DOI metadata.
                                </Tooltip>
                            }>
                            <h4>{title} <FontAwesomeIcon icon={faQuestionCircle} /></h4>
                        </OverlayTrigger>
                        <ul id="authors-facets">
                            {authors.filter(removeNullAuthors).filter(checkAuthorForPerson).map((facet) => (
                                <li key={facet.id}>
                                    {facetLink(
                                        'filterQuery',
                                        'creators_and_contributors.nameIdentifiers.nameIdentifier:"' +
                                        facet.id +
                                        '"',
                                        'co-authors-facet-' + facet.id
                                    )}
                                    <div className="facet-title">{facet.title}</div>
                                    <span className="number pull-right">
                                        {facet.count.toLocaleString('en-US')}
                                    </span>
                                    <div className="clearfix" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </React.Fragment>
    )

}
export default AuthorsFacet
