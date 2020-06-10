import * as React from 'react'
import { gql } from "apollo-boost"
import Error from "./Error"
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link'
import Doi from './Doi'
import { DoiType } from './types';


type Props = {
  item?: string
}


export const DOI_GQL = gql`
  query getContentQuery($id: ID!) {
  work(id: $id){
    titles{
      title
    }
    types{
      resourceTypeGeneral
      resourceType
    }
    creators {
      id
      name
      givenName
      familyName
    }
    version
    publicationYear
    publisher
    descriptions{
      description
    }
  	rights{
      rights
      rightsUri
    }
    id
    formattedCitation
    citationCount
    citationsOverTime{
      year
      total
    }
    viewCount
    viewsOverTime{
      yearMonth
      total
    }
    downloadCount
    downloadsOverTime{
      yearMonth
      total
    }
    citations{
      nodes{
        formattedCitation
      }
    }
    references{
      nodes{
        formattedCitation
      }  
    }
  }
}
`


interface DoiQueryData {
  doi: DoiType
}

interface DoiQueryVar {
  id: string;
}


const DoiContainer: React.FunctionComponent<Props> = ({item}) => {

  const [doi, setDoi] = React.useState<DoiType>();
  const { loading, error, data } = useQuery<DoiQueryData, DoiQueryVar>(
      DOI_GQL,
      {
          errorPolicy: 'all',
          variables: { id: item }
      }
  )

  React.useEffect(() => {
    let result = undefined;
    if(data) {
      result = data.work;
    }

      setDoi(result);
  }, [item, data]);

  if (loading) return <p>Loading...</p>;

  if (error) {
      return <Error title="No Content" message="Unable to retrieve Content" />
  }

  if (!doi ) return <p>Content not found.</p>;


  return (
    <div key={doi.id} className="panel panel-transparent content-item">
      <div className="panel-body">
        <Doi item={doi}/>
      </div>
      <br/>
    </div>
  )
}

export default DoiContainer
