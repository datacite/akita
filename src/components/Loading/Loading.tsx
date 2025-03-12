import React from 'react'
import Col from 'react-bootstrap/Col'
import ContentLoader from 'react-content-loader'

interface Props {
  offset?: boolean
}

export default function Loading({ offset = true }: Props) {
  return <Col md={{ span: 9, offset: offset ? 3 : 0 }}>
    <ContentLoader
      speed={1}
      width={1000}
      height={250}
      viewBox="0 0 1000 250"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      uniqueKey="r1x6b4d-rph"
    >
      <rect x="117" y="34" rx="3" ry="3" width="198" height="14" />
      <rect x="117" y="75" rx="3" ry="3" width="117" height="14" />
      <rect x="9" y="142" rx="3" ry="3" width="923" height="14" />
      <rect x="9" y="178" rx="3" ry="3" width="855" height="14" />
      <rect x="9" y="214" rx="3" ry="3" width="401" height="14" />
      <circle cx="54" cy="61" r="45" />
    </ContentLoader>
  </Col>
}

