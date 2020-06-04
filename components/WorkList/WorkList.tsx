import _ from 'lodash'
import { Alert } from 'react-bootstrap'

// this interface defines the shape of the data returned by the works query.
interface WorkQueryItem {
  id: string;
  doi: string;
  url: string;
  types: {
    resourceTypeGeneral: string
    resourceType: string
  }
  creators: Creator[]
  titles: Title[]
  publicationYear: number
  publisher: string
  descriptions: Description[]
}

interface Creator {
  id: string
  name: string
  givenName: string
  familyName: string
}

interface Title {
  title: string
}

interface Description {
  description: string
}

interface WorkNode {
  node: WorkQueryItem
}

interface WorkFacet {
  id: string
  title: string
  count: number
}

interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

interface WorkQueryData {
  works: {
      __typename: String;
      nodes: WorkNode[];
      pageInfo: PageInfo;
      resourceTypes: WorkFacet[];
      registrationAgencies: WorkFacet[];
      totalCount: Number;
  },
}

const WorkList = ({ workQueryResult }: WorkQueryData) => {
  if (!workQueryResult) {
    return (
      <Alert variant="info">
        Loading...
      </Alert>
      // <div className="centered">
      //   <img className="img-big" src="/images/logo-big.png" />
      
      //   <style jsx global>{`
      //       .img-big {
      //           margin-top: 24px;
      //       }
      //     `}</style>
      // </div>
    )
  } else {
    console.log(workQueryResult)

    const listItems = workQueryResult.nodes.map((work) => {
      let creators = work.creators.map((creator) =>
        creator.familyName ? [creator.givenName, creator.familyName].join(' ') : creator.name
      ).join(', ');

      return (
        <div key={work.id} className="panel panel-transparent">
          <div className="panel-body">
            <h3 className="member">
              {work.titles[0].title} <span className="small">{work.types.resourceTypeGeneral}</span>
            </h3>
            {creators}
            <div className="metadata">{work.types.resourceType ? _.startCase(work.types.resourceType) : 'Content'} published {work.publicationYear} via {work.publisher}</div>
            <div className="description">{work.descriptions[0] ? work.descriptions[0].description : ''}</div>
          </div>
          <div className="panel-footer">
            <a href={work.id}><i className='fa fa-external-link'></i> {work.id}</a>
          </div>
          <br/>
        </div>
      )
    })
    
    return (
      <div>
        <h3 className="member-results">{workQueryResult.totalCount.toLocaleString('en-US')} Results</h3>
        {listItems}
      </div>
    )
  }
}

export default WorkList