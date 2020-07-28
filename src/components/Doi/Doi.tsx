import * as React from 'react'
import { Tabs, Tab, Alert } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import CitationsChart from '../CitationsChart/CitationsChart'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { compactNumbers } from '../../utils/helpers'


import DoiRelatedContent from '../DoiRelatedContent/DoiRelatedContent'

import UsageChart from '../UsageChart/UsageChart'

type Props = {
  doi: DoiType
}

const DoiPresentation: React.FunctionComponent<Props> = ({doi}) => {
  if (!doi ) return (
    <Alert bsStyle="warning">
      No content found.
    </Alert>
  )


  return (
    <div key={doi.id} className="panel panel-transparent">
      <h2 className="member-results">{doi.doi}</h2>
      <DoiMetadata metadata={doi}></DoiMetadata>
      <br/>
      {/* {formattedCitation()}
      {analyticsBar()}
      {relatedContent()} */}
    </div>
  )
}

export default DoiPresentation
