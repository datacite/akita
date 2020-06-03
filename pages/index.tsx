import React from "react"
import WorkList from "../components/WorkList/WorkList"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import Layout from '../components/Layout/Layout'

const IndexPage = () => {
  // our query that defines the attributes we want to get.
  const WORKS_QUERY = gql`
    query {
      works {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        resourceTypes {
          id
          title
          count
        }
        registrationAgencies {
          id
          title
          count
        }
        nodes {
          id
          doi
          types {
            resourceTypeGeneral
            resourceType
          }
          titles {
            title
          }
          descriptions {
            description
            descriptionType
          }
          creators {
            id
            name
            givenName
            familyName
          }
          publicationYear
          publisher
        }
      }
    }
  `

  // the hook that calls the query.
  const worksQuery = useQuery(WORKS_QUERY)

  return (
    <Layout title="DataCite Commons Stage">
      <div className="row">
        <div className="col-md-8 col-md-offset-3 panel-list" id="content">
          <form className="form-horizontal">
            <div id="search" className="input-group">
              <input name="query" placeholder="Type to search..." className="form-control" type="text" />
              <div className="input-group-btn">
                <button className="btn btn-primary hidden-xs" type="submit">Search</button>
              </div>
            </div>
          </form>

          <WorkList workQueryResult={worksQuery?.data?.works || null} />
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
