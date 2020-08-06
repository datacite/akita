import React from 'react'
import { useQueryState } from 'next-usequerystate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'

type Props = {
    name: string
    id: string
    title: string
    count: number
}

const FilterItem: React.FunctionComponent<Props> = ({ name, id, title, count }) => {
    const [activeFilter, setActiveFilter] = useQueryState<string>(name)

    const activeIcon = (id: string) => {
        let icon = faSquare
        if (id == activeFilter) {
            icon = faCheckSquare
        }

        return (
            <FontAwesomeIcon icon={icon} />
        )
    }

    const toggleFilter = (id: string) => {
        if (activeFilter !== id) {
            setActiveFilter(id)
        } else {
            setActiveFilter(null)
        }
    }

    return (
        <div>
            <a onClick={() => toggleFilter(id)}>{activeIcon(id)}</a>
            <div className="facet-title">{title}</div>
            <span className="number pull-right">{count.toLocaleString('en-US')}</span>
            <div className="clearfix" />
        </div>
    )
}

export default FilterItem
