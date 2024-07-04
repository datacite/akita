import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Container, Row, Col } from "src/components/Layout-4";

import apolloClient from 'src/utils/apolloClient'
import { Work as WorkType } from 'src/data/types'
import { DOI_QUERY, QueryVar, QueryData } from 'src/data/queries/doiQuery'

import Error from 'src/components/Error/Error'
import { Title as TitleComponent } from 'src/components/Title/Title'
import Claim from 'src/components/Claim/Claim'
import CiteAs from 'src/components/CiteAs/CiteAs'
import DownloadMetadata from 'src/components/DownloadMetadata/DownloadMetadata'
import DownloadReports from 'src/components/DownloadReports/DownloadReports'
import ShareLinks from 'src/components/ShareLinks/ShareLinks'
import Work from 'src/components/Work/Work'
import { isProject } from 'src/utils/helpers';

interface Props {
  variables: QueryVar
  isBot?: boolean
}

export default async function Content(props: Props) {
  const { variables, isBot = false } = props

  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: DOI_QUERY,
    variables: variables,
    errorPolicy: 'all'
  })

  if (error) return (
    <Col md={{ span: 9, offset: 3 }}>
      <Error title="An error occured." message={error.message} />
    </Col>
  )

  const work = data?.work || {} as WorkType

  const title = work.titles[0]?.title || ''
  const handleUrl =
    work.registrationAgency.id === 'datacite'
      ? work.id
      : 'https://doi.org/' + work.doi

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col md={{ offset: 3 }}>
          <TitleComponent title={ReactHtmlParser(title)} titleLink={handleUrl} link={'https://doi.org/' + work.doi} rights={work.rights} />
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Row className="mb-2">
            {work.registrationAgency.id == "datacite" && (
              <Col xs={12} className="mb-2">
                <Claim doi_id={work.doi} />
              </Col>
            )}
            <Col xs={12}>
              <DownloadMetadata doi={work} />
            </Col>
          </Row>
          <Row className="mb-2">
            <CiteAs doi={work} />
          </Row>
          <Row className="mb-2">
            {!isBot && <DownloadReports
              links={[
                {
                  title: 'Related Works (CSV)',
                  helpText: `Includes descriptions and formatted citations in APA style for up to 200 DOIs associated with this ${isProject(work) ? 'project' : 'work'}.`,
                  type: 'doi/related-works',
                }
              ]}
              variables={variables as any}
            />}
            <ShareLinks url={'doi.org/' + work.doi} title={title} />
          </Row>
        </Col>

        <Col md={9} className="px-0">
          <Work doi={work} />
        </Col>
      </Row>
    </Container>
  )
}
