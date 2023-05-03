import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { WorkType } from '../../pages/doi.org/[...doi]'
import CitationFormatter from '../CitationFormatter/CitationFormatter'

type Props = {
  doi: WorkType
}

const CiteAs: React.FunctionComponent<Props> = ({ doi }) => {
  const [selectedOption, setSelectedOption] = React.useState('')

  return (
    <div>
      <Row><Col xs={12}>
        <CitationFormatter
          id={doi.doi}
          input={doi.formattedCitation}
          locale="en"
          style={selectedOption}
        />
      </Col></Row>
      <Row><Col xs={12}>
        <div id="citation" className="input-group pull-right">
          <select
            className="cite-as"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="apa">APA</option>
            <option value="harvard-cite-them-right">Harvard</option>
            <option value="modern-language-association">MLA</option>
            <option value="vancouver">Vancouver</option>
            <option value="chicago-fullnote-bibliography">Chicago</option>
            <option value="ieee">IEEE</option>
          </select>
        </div>
        </Col></Row>
    </div>
  )
}

export default CiteAs
