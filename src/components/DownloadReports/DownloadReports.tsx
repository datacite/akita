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
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org'
  
    return (
      <div className="panel panel-transparent download-reports">
        <div className="panel-body">
          <Row>
            <Col className="download-list" id="full-metadata" xs={12}>
              <div id="export-xml">
                <a
                  // target="_blank"
                  rel="noreferrer"
                  href={`${apiurlBase}/related-works?${params}`}
                >
                  Related Works
                </a>
              </div>
              <div id="export-json">
                <a
                  // target="_blank"
                  rel="noreferrer"
                  href={`${apiurlBase}/abstracts?${params}`}
                >
                  Abstracts
                </a>
              </div>
              <div id="export-ld" className="download">
                <a
                  // target="_blank"
                  rel="noreferrer"
                  href={`${apiurlBase}/funders?${params}`}
                >
                  Funders
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
