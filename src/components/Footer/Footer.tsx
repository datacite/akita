import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faBlog } from '@fortawesome/free-solid-svg-icons'
import {
  faLinkedin,
  faGithub,
  faYoutube,
  faMastodon
} from '@fortawesome/free-brands-svg-icons'

import StatusPage from 'src/components/Footer/Status'
import Links from 'src/components/Footer/Links'

import LINKS from 'src/data/footer_links'


export default function Footer() {
  return (
    <footer className="footer d-none d-sm-block">
      <Container>
        <Row>
          <Col sm={3} md={3} className="footer-column">
            <h4 data-cy="about">About Us</h4>
            <Links links={LINKS.about_links} />
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4>Work With Us</h4>
            <Links links={LINKS.services_links} />
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4>Membership</h4>
            <Links links={LINKS.community_links} />
            <h4>Resources</h4>
            <Links links={LINKS.resources_links} />
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4 className="share">Contact Us</h4>
            <a
              href="mailto:support@datacite.org"
              className="share"
              aria-label="Email DataCite support"
            >
              <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
            </a>
            <a
              href="https://datacite.org/blog/"
              className="share"
              aria-label="Visit the DataCite blog"
            >
              <FontAwesomeIcon icon={faBlog} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/datacite/datacite"
              className="share"
              aria-label="Visit DataCite on GitHub"
            >
              <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com/datacite"
              className="share"
              aria-label="Visit DataCite on X"
            >
              <svg aria-hidden="true" focusable="false" data-prefix="fab" className="svg-inline--fa fa-twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
            </a>
            <a
              href="https://openbiblio.social/@datacite"
              className="share"
              aria-label="Visit DataCite on Mastodon"
            >
              <FontAwesomeIcon icon={faMastodon} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/company/datacite"
              className="share"
              aria-label="Visit DataCite on LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com/@DataCiteChannel"
              className="share"
              aria-label="Visit the DataCite YouTube channel"
            >
              <FontAwesomeIcon icon={faYoutube} aria-hidden="true" />
            </a>
            <Links links={LINKS.contact_links} />
            <StatusPage />
            <h4>Funding</h4>
            <ul>
              <li className="funding">
                The work on DataCite Commons is supported by funding from the
                European Union’s Horizon 2020 research and innovation programme
                under grant agreement No{' '}
                <a
                  href="https://cordis.europa.eu/project/id/777523"
                  target="_blank"
                  rel="noreferrer"
                >
                  777523
                </a>
                .
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
