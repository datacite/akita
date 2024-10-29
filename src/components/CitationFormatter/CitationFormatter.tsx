import React from 'react'
import Error from '../Error/Error'
import { Col, Alert } from 'react-bootstrap'
import ReactHtmlParser from 'html-react-parser'
import { useFormattedCitationQuery } from 'src/data/queries/formattedCitationQuery'

type Props = {
  id: string
  style?: string
  locale?: string
  input?: string
}

export default function CitationFormatter({ id, style, locale }: Props) {
  const cslType = style || 'apa'
  const [formatted, setFormattedCitation] = React.useState<string>('')

  const variables = { id: id, style: cslType, locale: locale }
  const { loading, error, data } = useFormattedCitationQuery(variables)

  React.useEffect(() => {
    const result = data?.work['formattedCitation'] || ''
    setFormattedCitation(result)
  }, [id, data])

  if (error) {
    return <Error title="No Content" message="Unable to retrieve Content" />
  }

  if (!loading && !formatted)
    return <Alert variant="warning">No content found.</Alert>

  return (<>
    <Col xs={12}>
      <h3 className="member-results">Cite as</h3>
    </Col>
    <Col xs={12} className="formatted-citation">
      {ReactHtmlParser(formatted)}
    </Col>
  </ >
  )
}

