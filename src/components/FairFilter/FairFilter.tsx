import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSquare,
    faCheckSquare,
    faQuestionCircle
} from '@fortawesome/free-regular-svg-icons'
import { useQueryStates, queryTypes } from 'next-usequerystate'

type Props = {
    name?: string
}
const FairFilter: React.FunctionComponent<Props> = () => {

    const [fairCriterias, setFairCriteria] = useQueryStates({
        hasPid: queryTypes.string.withDefault(''),
        isOpen: queryTypes.string.withDefault(''),
        subjectId: queryTypes.string.withDefault('')
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
        {id: "fair-filter-3", title: "none CLEAR"},
    ]

    const activeIcon = (fid: boolean) => {
        let icon = faSquare
        if (fid == true) {
          icon = faCheckSquare
        }
    
        return <FontAwesomeIcon icon={icon} />
      }

    const toggleFilter = (fid: boolean, filterId: string) => {
        if (true == fid) {
            switch (filterId) {
                case "fair-filter-1":
                    setFairCriteria({
                        hasPid: "true",
                        isOpen: "true",
                        subjectId: "34"
                    })
                    break;
                case "fair-filter-2":
                    setFairCriteria({
                        hasPid: "true",
                        isOpen: "true",
                        subjectId: null
                    })
                    break;
                default:
                    setFairCriteria({
                        hasPid: null,
                        isOpen: null,
                        subjectId: null
                    })
                    break;
                    }
        } else {
            setFairCriteria({
                hasPid: hasPid,
                isOpen: isOpen,
                subjectId: subjectId
            })
        }
      }

    function filterLink(value: string, filterId: string) {

        return (
            <div>
                <a className={"facet-"} onClick={() => toggleFilter(true, filterId)}>{activeIcon(false)}</a>
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
