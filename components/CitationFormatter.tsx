
import * as React from 'react'

import Error from "./Error"
import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost"
import ReactHtmlParser from 'react-html-parser'


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
  query getContentQuery($id: ID!, $style: String!, $locale: String!) {
  work(id: $id){
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
  locale: string
}


const CitationFormatter: React.FunctionComponent<Props> = ({id, style, locale, input}) => {

  const cslType = style || "apa";

  const [formatted, setFormattedCitation] = React.useState();
  const { loading, error, data } = useQuery<FormattedCitationQueryData, FormattedCitationQueryVar>(
    FORMATTEDCITATION_GQL,
      {
          errorPolicy: 'all',
          variables: { id: id, style: cslType, locale: locale }
      }
  )

  React.useEffect(() => {
    let result = undefined;
    console.log(data)
    if(data) {
      result = data.work['formattedCitation'];
    }

      setFormattedCitation(result);
  }, [id, data]);

  if (loading) return <p>Loading...</p>;

  if (error) {
      return <Error title="No Content" message="Unable to retrieve Content" />
  }

  if (!formatted ) return <p>Content not found.</p>;


  // const formattedCitationString: string = formatted.formattedCitation


  return ( 

    <div>
      <h3 className="member-results">Cite as</h3>
      <div className="panel panel-transparent">
      <div className="formatted-citation panel-body">
        {style ? ReactHtmlParser(formatted) : ReactHtmlParser(input)}
        </div>
      </div>
    </div>

   );
}

export default CitationFormatter
