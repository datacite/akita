import React from 'react'
import Error from '../Error/Error'
import { gql, useQuery } from '@apollo/client'
import { Alert } from 'src/components/Layout'
import ReactHtmlParser from 'html-react-parser'

type Props = {
  id: string
  style?: string
  locale?: string
  input?: string
}

interface FormattedCitation {
  id: string
  formattedCitation: string
}

export const FORMATTEDCITATION_GQL = gql`
  query getCitationFormatter($id: ID!, $style: String!, $locale: String!) {
    work(id: $id) {
      id
      formattedCitation(style: $style, locale: $locale)
    }
  }
`

interface FormattedCitationQueryData {
  work: FormattedCitation
}

interface FormattedCitationQueryVar {
  id: string
  style: string
  locale?: string
}

const CitationFormatter: React.FunctionComponent<Props> = ({
  id,
  style,
  locale
}) => {
  const cslType = style || 'apa'
  const [formatted, setFormattedCitation] = React.useState<string>('')
  const { loading, error, data } = useQuery<
    FormattedCitationQueryData,
    FormattedCitationQueryVar
  >(FORMATTEDCITATION_GQL, {
    errorPolicy: 'all',
    variables: { id: id, style: cslType, locale: locale }
  })

  React.useEffect(() => {
    const result = data?.work['formattedCitation'] || ''
    setFormattedCitation(result)
  }, [id, data])

  if (error) {
    return <Error title="No Content" message="Unable to retrieve Content" />
  }

  if (!loading && !formatted)
    return <Alert bsStyle="warning">No content found.</Alert>

  return (
    <div>
      <h3 className="member-results">Cite as</h3>
      <div className="panel panel-transparent">
        <div className="formatted-citation panel-body">
          {ReactHtmlParser(formatted)}
        </div>
      </div>
    </div>
  )
}

export default CitationFormatter
