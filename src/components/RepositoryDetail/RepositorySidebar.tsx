import React from 'react'
import Button from 'react-bootstrap/Button'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import { Repository } from 'src/data/types';
import { Col, Row } from 'react-bootstrap'

type Props = {
  repo: Repository
}


export function RepositorySidebar({ repo }: Props) {

  function ContactList() {
    if (repo.contact?.length <= 0) return null

    const contacts = repo.contact.map((contact) => (
      {
        text: contact,
        link: contact.startsWith('http') ? contact : "mailto:" + contact
      }
    ));

    return <>
      <Row as="h3" className="member-results mt-4">Contacts</Row>

      <Row>
        <Col as="ul" className="p0">
          {contacts.map(({ text, link }, index) => (
            <Row as="li" key={"contact-" + index}>
              <a id={"contact-link-" + index} href={link} className="text-break p0">{text}</a>
            </Row>
          ))}
        </Col></Row>
    </>
  }

  function GoToRepositoryButton() {
    if (!repo.url) return null

    return <Button id="go-to-repo" variant="default" href={repo.url}>
      <FontAwesomeIcon icon={faSignInAlt} />
      &nbsp;
      Go to Repository
    </Button>
  }

  function FindRelatedWorksButton() {
    if (!repo.clientId) return null

    return <Button variant="primary" href={"/doi.org?query=client.uid:" + repo.clientId} id="find-related">
      <FontAwesomeIcon icon={faNewspaper} />
      &nbsp;
      Find Related Works
    </Button>
  }


  return <Col md={3} className="mt-4">
    <div className="d-grid gap-2">
      <GoToRepositoryButton />
      <FindRelatedWorksButton />
    </div>
    <ContactList />
  </Col>
}
