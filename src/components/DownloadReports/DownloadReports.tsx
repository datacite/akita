import React from 'react'
import { Row, Col } from 'react-bootstrap'

type Props = {
  url: string
  title?: string
  variables: {
    id: string,
    gridId: string,
    crossrefFunderId: string,
    cursor: string,
    filterQuery: string,
    published: string,
    resourceTypeId: string,
    fieldOfScience: string,
    language: string,
    license: string,
    registrationAgency: string
  }
}

const DownloadReports: React.FunctionComponent<Props> = ({ variables}) => {

  const filteredVariables = Object.fromEntries(Object.entries(variables).filter(([, value]) => value))
  const params = new URLSearchParams(filteredVariables).toString()

  const apiurlBase = '/api/download-reports'


  const downloadReports = () => {  
    return (
      <div className="panel panel-transparent download-reports">
        <div className="panel-body">
          <Row>
            <Col className="download-list" id="full-metadata" xs={12}>
              <div id="download-related-works">
                <a
                  rel="noreferrer"
                  href={`${apiurlBase}/related-works?${params}`}
                  download
                >
                  Related Works (CSV)
                </a>
              </div>
              <div id="download-funders" className="download">
                <a
                  rel="noreferrer"
                  href={`${apiurlBase}/funders?${params}`}
                  download
                >
                  Funders (CSV)
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  return (
    <>
      <h3 className="member-results">Download Reports</h3>
      {downloadReports()}
    </>
  )
}

export default DownloadReports
