'use client'

import React, { useState } from 'react'
import DataCiteButton from 'src/components/DataCiteButton/DataCiteButton'
import Modal from 'react-bootstrap/Modal'

interface Props {
  modalContent: React.ReactNode
}

export default function DownloadMetadata({ modalContent }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (<>
    <DataCiteButton
      onClick={() => setShowModal(true)}
      outline
      className='w-100'
      title="Download Metadata"
      id="download-metadata-button"
    >
      Download Metadata
    </DataCiteButton>

    <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Body>{modalContent}</Modal.Body>
      <Modal.Footer style={{ padding: 10 }}>
        <DataCiteButton
          onClick={() => setShowModal(false)}
          variant='outline-primary'
          id='close-modal'
        >
          Close
        </DataCiteButton>
      </Modal.Footer>
    </Modal>
  </>)

}

