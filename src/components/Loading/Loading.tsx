import React from 'react'
import { Col } from 'src/components/Layout'
import ContentLoader from 'react-content-loader'

const Loading: React.FunctionComponent = () => (
  <Col md={9} mdOffset={3}>
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
)

export default Loading
