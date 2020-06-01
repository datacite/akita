import React from "react"
import WorkList from "../components/WorkList"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import Layout from '../components/Layout'

const IndexPage = () => {
  // our query that defines the attributes we want to get.
  const WORKS_QUERY = gql`
    query {
      works {
        totalCount
        years {
          id
          count
        }
        nodes {
          id
          doi
          titles {
            title
          }
          descriptions {
            description
            descriptionType
          }
          creators {
            name
          }
          publicationYear
          publisher
        }
      }
    }
  `

  // the hook that calls the query.
  const works = useQuery(WORKS_QUERY)

  return (
    <Layout title="DataCite Commons Stage">
      <div className="row">
        <div className="col-md-6 col-md-offset-3 panel-list" id="content">
          <form className="form-horizontal">
            <div id="search" className="input-group">
              <input name="query" placeholder="Type to search..." className="form-control" type="text" />
              <div className="input-group-btn">
                <button className="btn btn-primary hidden-xs" type="submit">Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <WorkList works={works?.data?.works || []} />
    </Layout>
  )
}

export default IndexPage
