import React from 'react'
import { Row, Col } from 'src/components/Layout'
import HelpIcon from '../HelpIcon/HelpIcon'


type DownloadType = 'doi/related-works' | 'ror/related-works' | 'ror/funders'


type Props = {
  links: { title: string, helpText?: string, type: DownloadType }[]
  variables: { [prop: string]: string }
}

const API_URL_BASE = '/api/download-reports'


const link = ({ title, helpText, type }: Props['links'][number], params: string) => {
  return (
    <div id={`download-${type}`} key={title}>
      <a rel="noreferrer" href={`${API_URL_BASE}/${type}?${params}`} download>
        {title}{' '}
      </a>
      { helpText && <HelpIcon text={helpText} size={20} position='inline' /> }
    </div>
  )
}

const DownloadReports: React.FunctionComponent<Props> = ({ links, variables}) => {

  if (links.length === 0) return <></>

  const filteredVariables = Object.fromEntries(Object.entries(variables).filter(([, value]) => value))
  const params = new URLSearchParams(filteredVariables).toString()


  const downloadReports = () => {  
    return (
      <div className="panel panel-transparent download-reports">
        <div className="panel-body">
          <Row>
            <Col className="download-list" id="full-metadata" xs={12}>
              {links.map(l => link(l, params))}
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
