'use client'

import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'
import DataCiteButton from 'src/components/DataCiteButton/DataCiteButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { ACCENT_COLOR, PROFILES_URL } from 'src/data/constants'

// import { session } from "src/utils/session";
import styles from './DiscoverWorksAlert.module.scss'


export default function DiscoverWorksAlert() {
  // const user = session()

  const [show, setShow] = useState(true);

  // if (!user) return

  const hrefWorksById = '/doi.org?query="ORCID iD"'
  const hrefWorksByName = '/doi.org?query="name"'
  // const hrefWorksById = `/doi.org?query=${user.uid}`
  // const hrefWorksByName = `/doi.org?query=${user.name}`
  const hrefAccountSettings = `${PROFILES_URL}/settings/me`

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

