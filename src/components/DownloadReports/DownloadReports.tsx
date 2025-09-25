import React from 'react'
import Col from 'react-bootstrap/Col'
import HelpIcon from 'src/components/HelpIcon/HelpIcon'


type DownloadType = 'doi/related-works' | 'ror/related-works' | 'ror/funders'


type Props = {
  links: { title: string, helpText?: string, type: DownloadType }[]
  variables: { [prop: string]: string }
}

const API_URL_BASE = '/download-reports'


function link({ title, helpText, type }: Props['links'][number], params: string) {
  return (
    <div id={`download-${type}`} key={title}>
      <a rel="noreferrer" href={`${API_URL_BASE}/${type}?${params}`} download>
        {title}{' '}
      </a>
      {helpText && <HelpIcon text={helpText} size={20} position='inline' />}
    </div>
  )
}

export default function DownloadReports({ links, variables }: Props) {

  if (links.length === 0) return <></>

  const filteredVariables = Object.fromEntries(Object.entries(variables).filter(([, value]) => value))
  const params = new URLSearchParams(filteredVariables).toString()

  return (
    <>
      <Col xs={12}>
        <h3 className="member-results">Download Reports</h3>
      </Col>
      <Col className="download-list" xs={12}>
        {links.map(l => link(l, params))}
      </Col>
    </>
  )
}

