'use client'

import React, { CSSProperties } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

type Props = {
	text?: string
	link?: string
	size?: number
	color?: string
	position?: 'inline' | 'top-right'
	padding?: number
}

const HelpIcon: React.FunctionComponent<Props> = ({ text = null, link = null, size = 24, color = 'gray', position = 'top-right', padding = 0 }) => {
	if (text === null && link === null) return <></>;

	const positionStyle: CSSProperties = position == 'top-right' ? { position: 'absolute', top: 0, right: padding } : {}

	function Icon() {
		if (link !== null) return (
			<a href={link} target="_blank" rel="noreferrer" className='help-icon' style={positionStyle}>
				<FontAwesomeIcon icon={faQuestionCircle} fontSize={size} />
			</a>
		)

		return <FontAwesomeIcon
			icon={faQuestionCircle}
			fontSize={size}
			color={color}
			style={positionStyle}
		/>
	}

	if (text === null) return <Icon />

	return <OverlayTrigger
		placement="top"
		overlay={
			<Tooltip id="helpTooltip">{text}</Tooltip>
		}>
		<span>{Icon()}</span>
	</OverlayTrigger>
}

export default HelpIcon
