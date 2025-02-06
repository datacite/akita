'use client'

import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSquare,
    faCheckSquare,
    faQuestionCircle
} from '@fortawesome/free-regular-svg-icons'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Props = {
    url: string
}

export default function FairFilter({ url }: Props) {

    const searchParams = useSearchParams()
    const params1 = new URLSearchParams(Array.from(searchParams?.entries() || []));
    const params2 = new URLSearchParams(Array.from(searchParams?.entries() || []));
    const paramsNull = new URLSearchParams(Array.from(searchParams?.entries() || []));

    const hasPid = params1.get('hasPid')
    const isOpen = params1.get('isOpen')
    const subjectId = params1.get('subjectId')

    params1.set('hasPid', 'true')
    params1.set('isOpen', 'true')
    params1.delete('isCertified')
    params1.set('subjectId', '34')

    params2.set('hasPid', 'true')
    params2.set('isOpen', 'true')
    params2.set('isCertified', 'true')
    params2.delete('subjectId')

    paramsNull.delete('hasPid')
    paramsNull.delete('isOpen')
    paramsNull.delete('isCertified')
    paramsNull.delete('subjectId')

    const tooltipFAIRfilters = (
        <Tooltip id="tooltipFAIRfilters">
            See the repositories in re3data that meet the FAIR criterias.
        </Tooltip>
    )


    const criterias = [
        { id: "fair-filter-1", title: "Enabling FAIR Data Project", isActive: hasPid === 'true' && isOpen === 'true' && subjectId === '34', params: params1 },
        { id: "fair-filter-2", title: "FAIR's FAIR Project", isActive: hasPid === 'true' && isOpen === 'true' && !subjectId, params: params2 },
    ]

    const activeIcon = (isActive: boolean) => {
        let icon = faSquare
        if (isActive) {
            icon = faCheckSquare
        }

        return <FontAwesomeIcon icon={icon} />
    }

    function filterLink(filter: typeof criterias[number]) {
        const href = url + (filter.isActive ? paramsNull.toString() : filter.params.toString())

        return (
            <li key={filter.id}>
                <div>
                    <Link href={href} id={filter.id} className={"facet-" + filter.id}>
                        {activeIcon(filter.isActive)}
                    </Link>
                    <div className="facet-title">{filter.title}</div>
                    <div className="clearfix" />
                </div>
            </li>
        )
    }


    return (
      <div className="panel panel-transparent facets">
            <OverlayTrigger placement="top" overlay={tooltipFAIRfilters}>
                <h4>
                    Criterias Compliance <FontAwesomeIcon icon={faQuestionCircle} />
                </h4>
            </OverlayTrigger>
            <ul id="fair-filter">
                {criterias.map(filterLink)}
            </ul>
        </div>
    )

}
