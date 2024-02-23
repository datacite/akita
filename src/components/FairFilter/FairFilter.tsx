import React from 'react'
import { Tooltip } from 'react-bootstrap'
import OverlayTrigger from '../OverlayTrigger/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSquare,
    faCheckSquare,
    faQuestionCircle
} from '@fortawesome/free-regular-svg-icons'
import { useQueryStates, queryTypes } from 'nuqs'

type Props = {
    name?: string
}
const FairFilter: React.FunctionComponent<Props> = () => {

    const [fairCriterias, setFairCriteria] = useQueryStates({
        hasPid: queryTypes.string.withDefault(''),
        isOpen: queryTypes.string.withDefault(''),
        subjectId: queryTypes.string.withDefault(''),
        isCertified: queryTypes.string.withDefault('')
    })

    const tooltipFAIRfilters = (
        <Tooltip id="tooltipFAIRfilters">
            See the repositories in re3data that meet the FAIR criterias.
        </Tooltip>
    )

    const { hasPid, isOpen, subjectId } = fairCriterias


    const criterias = [
        {id: "fair-filter-1", title: "Enabling FAIR Data Project"},
        {id: "fair-filter-2", title: "FAIR's FAIR Project"},
    ]

    const activeIcon = (fid: string) => {
        let icon = faSquare
        if (fid == activeFairFilter()) {
          icon = faCheckSquare
        }
    
        return <FontAwesomeIcon icon={icon} />
      }

    function activeFairFilter(): string {
        switch(true) {
            case hasPid == 'true' && isOpen == 'true' && subjectId == '34':
                return "fair-filter-1"
            case hasPid == 'true' && isOpen == 'true' && !subjectId:
                return "fair-filter-2"
            default:
                return "none"
        }
    }

    const toggleFilter = (filterId: string) => {
        switch (filterId) {
            case "fair-filter-1":
                setFairCriteria({
                    hasPid: "true",
                    isOpen: "true",
                    isCertified: null,
                    subjectId: "34"
                })
                break;
            case "fair-filter-2":
                setFairCriteria({
                    hasPid: "true",
                    isOpen: "true",
                    isCertified: "true",
                    subjectId: null
                })
                break;
        }
        if (filterId == activeFairFilter()) {
            setFairCriteria({
                hasPid: null,
                isOpen: null,
                isCertified: null,
                subjectId: null
            })
        }
    }

    function filterLink(value: string, filterId: string) {

        return (
            <div>
                <a id={filterId} className={"facet-"+filterId} onClick={() => toggleFilter(filterId)}>{activeIcon(filterId)}</a>
                <div className="facet-title">{value}</div>
                <div className="clearfix" />
            </div>
        )
    }


    return (
        <React.Fragment>
            <div className="panel facets add">
                <div className="panel-body">
                    <OverlayTrigger placement="top" overlay={tooltipFAIRfilters}>
                        <h4>
                            Criterias Compliance <FontAwesomeIcon icon={faQuestionCircle} />
                        </h4>
                    </OverlayTrigger>
                    <ul id="fair-filter">
                        {criterias.map((filter) => (
                            <li key={filter.id}>
                                {filterLink(
                                    filter.title,
                                    filter.id
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )

}
export default FairFilter
