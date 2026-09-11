import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Work as WorkType } from 'src/data/types'
import { fetchDoi } from 'src/data/queries/doiQuery'

import Error from 'src/components/Error/Error'
import TitleComponent from 'src/components/Title/Title'
import Claim from 'src/components/Claim/Claim'
import CiteAs from 'src/components/CiteAs/CiteAs'
import DownloadMetadata from 'src/components/DownloadMetadata/DownloadMetadata'
import Work from 'src/components/Work/Work'
import ExportMetadata from 'src/components/DownloadMetadata/ExportMetadata'
import CommonsLayout from 'src/components/CommonsLayout/CommonsLayout'

interface Props {
  doi: string
}

export default async function Content(props: Props) {
  const { doi } = props

  const { data, error } = await fetchDoi(doi)

  if (error)
    return (
      <CommonsLayout>
        <Error title="An error occured." message={error.message} />
      </CommonsLayout>
    )

  const work = data?.work || ({} as WorkType)

  const title = work.titles[0]?.title || ''
  const handleUrl =
    work.registrationAgency.id === 'datacite'
      ? work.id
      : 'https://doi.org/' + work.doi

  return (
    <>
      <CommonsLayout className="mb-4">
        <TitleComponent
          title={title}
          titleLink={handleUrl}
          link={'https://doi.org/' + work.doi}
          rights={work.rights}
        />
      </CommonsLayout>

      <CommonsLayout
        sidebarClassName="pe-5"
        mainClassName="px-0"
        sidebar={
          <>
            <Row className="mb-2 pb-4">
              <Col xs={12}>
                <DownloadMetadata
                  modalContent={<ExportMetadata doi={work} />}
                />
              </Col>
              {work.registrationAgency.id == 'datacite' && (
                <Col xs={12} className="mt-3 mb-3">
                  <Claim doi_id={work.doi} />
                </Col>
              )}
            </Row>
            <Row className="mb-2 pb-4">
              <CiteAs doi={work} />
            </Row>
          </>
        }
      >
        <Work doi={work} />
      </CommonsLayout>
    </>
  )
}
