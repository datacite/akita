import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

type Props = {
  text: string
	size?: number
	color?: string
}

const HelpIcon: React.FunctionComponent<Props> = ({ text, size=24, color='gray' }) => {
  return (
		<OverlayTrigger 
				placement="top"
				overlay={
						<Tooltip id="helpTootltip">{text}</Tooltip>
				}>
				<FontAwesomeIcon
					icon={faQuestionCircle}
					fontSize={size}
					color={color}
					style={{ position: 'absolute', top: 0, right: 0 }}
				/>
		</OverlayTrigger>
	)
}

export default HelpIcon
