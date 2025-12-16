'use client'

import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'
import DataCiteButton from 'src/components/DataCiteButton/DataCiteButton'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { PROFILES_SETTINGS_URL } from 'src/data/constants'

import { useSession } from "src/utils/session";
import styles from './DiscoverWorksAlert.module.scss'


export default function DiscoverWorksAlert() {
  const { user } = useSession()

  const [show, setShow] = useState(true);

  if (!user) return

  const hrefWorksById = `/doi.org?query=creators_and_contributors.nameIdentifiers.nameIdentifier:(${user.uid} OR "https://orcid.org/${user.uid}")&registration-agency=datacite`
  const hrefWorksByName = `/doi.org?query=${user.name}&registration-agency=datacite`
  const hrefAccountSettings = PROFILES_SETTINGS_URL

  return <Container fluid>
    <Row>
      <Col xs={12} md={{ span: 8, offset: 3 }} className="d-flex justify-content-center">
        <Toast show={show} onClose={() => setShow(false)} className={`${styles["toast-container"]} w-auto my-4 p-2 rounded-0`}>
          <Toast.Header className="border-0">
            <strong className="fs-5 me-auto">Add Works to your ORCID profile</strong>
          </Toast.Header>
          <Toast.Body>
            <p className="fs-6">
              Add Works to your ORCID profile from any Works page. Find your Works by ORCID iD, with your name, or by using a keyword search. Enable ORCID Auto-Update in Account Settings so DataCite DOIs with your ORCID iD are automatically added to your ORCID profile.
            </p>


            <div className={styles["button-container"]}>
              <DataCiteButton href={hrefWorksById} icon={faSearch}>
                Works with My ORCID iD
              </DataCiteButton>

              <DataCiteButton href={hrefWorksByName} icon={faSearch}>
                Works with My Name
              </DataCiteButton>

              <DataCiteButton href={hrefAccountSettings} outline>
                Account Settings
              </DataCiteButton>
            </div>
          </Toast.Body>
        </Toast>
      </Col>
    </Row>
  </Container >
}

