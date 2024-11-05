import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Work } from 'src/data/types'


interface Props {
  doi: Work
}


export default function ExportMetadata({ doi }: Props) {
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
