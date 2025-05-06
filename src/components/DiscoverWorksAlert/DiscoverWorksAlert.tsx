"use client"

import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-regular-svg-icons'
import { ACCENT_COLOR } from 'src/data/constants'

import styles from './DiscoverWorksAlert.module.scss'


export default function DiscoverWorksAlert() {
  const [show, setShow] = useState(true);

  return <Container fluid className="flex-grow-1">
    <Row>
      <Col xs={12} md={{ span: 9, offset: 3 }} className="d-flex justify-content-center">
        <Toast show={show} onClose={() => setShow(false)} className={`${styles["toast-container"]} w-auto my-4 border-0 rounded-0`}>
          <Toast.Header className="border-0">
            <FontAwesomeIcon icon={faUserCircle} fontSize={20} color={ACCENT_COLOR} className="me-2" />
            <strong className="fs-5 me-auto">Add Works to your ORCID profile</strong>
          </Toast.Header>
          <Toast.Body>
            <p className="fs-6">
              Add Works to your ORCID profile from any Works page. Find your Works by ORCID iD, with your name, or by using a keyword search. Enable ORCID Auto-Update in Account Settings so DataCite DOIs with your ORCID iD are automatically added to your ORCID profile.
            </p>


            <div className={styles["button-container"]}>
              <Button
                variant="primary"
                title="Download Metadata"
                // onClick={() => setShowModal(true)}
                className={styles.primary}
              >
                Works with My ORCID iD
              </Button>
              <Button
                variant="primary"
                title="Download Metadata"
                // onClick={() => setShowModal(true)}
                className={styles.primary}
              >
                Works with My Name
              </Button>
              <Button
                variant="outline-primary"
                title="Download Metadata"
                // onClick={() => setShowModal(true)}
                className={styles.secondary}
              >
                Account Settings
              </Button>
            </div>
          </Toast.Body>
        </Toast>
      </Col>
    </Row>
  </Container>
}

