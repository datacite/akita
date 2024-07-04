'use client'

import React from 'react'
import { Row, Col } from 'src/components/Layout-4'
import { Work } from 'src/data/types'
import CitationFormatter from '../CitationFormatter/CitationFormatter'

type Props = {
  doi: Work
}

export default function CiteAs({ doi }: Props) {
  const [selectedOption, setSelectedOption] = React.useState('')

  return (<>
    <CitationFormatter
      id={doi.doi}
      input={doi.formattedCitation}
      locale="en"
      style={selectedOption}
    />
    <Col>
      <select
        className="cite-as input-group float-right"
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="apa">APA</option>
        <option value="harvard-cite-them-right">Harvard</option>
        <option value="modern-language-association">MLA</option>
        <option value="vancouver">Vancouver</option>
        <option value="chicago-fullnote-bibliography">Chicago</option>
        <option value="ieee">IEEE</option>
      </select>
    </Col>
  </>)
}

