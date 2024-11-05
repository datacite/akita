'use client'

import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

interface Props {
  modalContent: React.ReactNode
}

export default function DownloadMetadata({ modalContent }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (<>
    <Button
      variant="btn-default"
      title="Download Metadata"
      onClick={() => setShowModal(true)}
      id="download-metadata-button"
      className="w-100"
    >
      Download Metadata
    </Button>

    <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Body>{modalContent}</Modal.Body>
      <Modal.Footer style={{ padding: 10 }}>
        <Button id='close-modal' variant='default' onClick={() => setShowModal(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  </>)

}

