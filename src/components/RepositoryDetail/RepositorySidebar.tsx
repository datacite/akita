import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Repository } from 'src/data/types';

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

  return <>
    <ContactList />
  </>
}
