import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

interface InfoTooltipProps {
  text: string
}

export const InfoTooltip = ({ text }: InfoTooltipProps) => (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip>{text}</Tooltip>}
  >
    <span
      onClick={(e) => e.stopPropagation()}
      className="ms-2"
      style={{ cursor: 'help' }}
    >
      <FontAwesomeIcon icon={faQuestionCircle} />
    </span>
  </OverlayTrigger>
)