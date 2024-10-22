'use client'

import React, { useState } from 'react'
import { Row, Col, Button, Modal } from 'react-bootstrap'
import { Work } from 'src/data/types'

type Props = {
  doi: Work
}

const DownloadMetadata: React.FunctionComponent<Props> = ({ doi }) => {
  const [showDownloadMetadataModal, setShowDownloadMetadataModal] = useState(false)

  const exportMetadata = () => {
    const showCrossrefMetadata = doi.registrationAgency.id === 'crossref'
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org'

    return (
      <>
        <h3 className="member-results" id="download">
          Download
        </h3>
        <div className="panel panel-transparent download">
          <div className="panel-body">
            <Row>
              <Col className="download-list" id="full-metadata" xs={6} md={4}>
                <h5>Full Metadata</h5>
                {showCrossrefMetadata && (
                  <div id="export-crossref">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        'https://api.crossref.org/works/' +
                        doi.doi +
                        '/transform/application/vnd.crossref.unixsd+xml'
                      }
                    >
                      Crossref UNIXREF
                    </a>
                  </div>
                )}
                <div id="export-xml">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl +
                      '/application/vnd.datacite.datacite+xml/' +
                      doi.doi
                    }
                  >
                    DataCite XML
                  </a>
                </div>
                <div id="export-json">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl +
                      '/application/vnd.datacite.datacite+json/' +
                      doi.doi
                    }
                  >
                    DataCite JSON
                  </a>
                </div>
                <div id="export-ld" className="download">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl + '/application/vnd.schemaorg.ld+json/' + doi.doi
                    }
                  >
                    Schema.org JSON-LD
                  </a>
                </div>
              </Col>
              <Col
                className="download-list"
                id="citation-metadata"
                xs={6}
                md={4}
              >
                <h5>Citation Metadata</h5>
                <div id="export-citeproc" className="download">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl +
                      '/application/vnd.citationstyles.csl+json/' +
                      doi.doi
                    }
                  >
                    Citeproc JSON
                  </a>
                </div>
                <div id="export-bibtex" className="download">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={apiUrl + '/application/x-bibtex/' + doi.doi}
                  >
                    BibTeX
                  </a>
                </div>
                <div id="export-ris" className="download">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl + '/application/x-research-info-systems/' + doi.doi
                    }
                  >
                    RIS
                  </a>
                </div>
                {doi.types.resourceTypeGeneral === 'Software' && (
                  <div id="export-codemeta" className="download">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        apiUrl + '/application/vnd.codemeta.ld+json/' + doi.doi
                      }
                    >
                      Codemeta
                    </a>
                  </div>
                )}
              </Col>
              {doi.contentUrl && (
                <Col xs={6} md={4}>
                  <h5>Fulltext Article</h5>
                  <div>
                    <a href={doi.contentUrl} target="_blank" rel="noreferrer">
                      via Unpaywall
                    </a>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </>
    )
  }


  return (<>
    <Button
      variant="btn-default"
      title="Download Metadata"
      onClick={() => setShowDownloadMetadataModal(true)}
      id="download-metadata-button"
      className="w-100"
    >
      Download Metadata
    </Button>

    <Modal size='lg' show={showDownloadMetadataModal} onHide={() => setShowDownloadMetadataModal(false)}>
      {/* <Modal.Header closeButton>
        <Modal.Title>Download Metadata</Modal.Title>
      </Modal.Header> */}
      <Modal.Body>{exportMetadata()}</Modal.Body>
      <Modal.Footer style={{ padding: 10 }}>
        <Button id='close-modal' variant='default' onClick={() => setShowDownloadMetadataModal(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  </>)

}

export default DownloadMetadata
