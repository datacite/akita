'use client'

import React from 'react'
import useSWR from 'swr'
import Container from 'react-bootstrap-4/Container'
import Row from 'react-bootstrap-4/Row'
import Col from 'react-bootstrap-4/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faBlog } from '@fortawesome/free-solid-svg-icons'
import {
  faLinkedin,
  faGithub,
  faYoutube,
  faMastodon
} from '@fortawesome/free-brands-svg-icons'

// TODO import Links from yml file
// import Links from '../../../config/links.yml'

const Links = {
  about_links: [
    { name: 'What we do', url: '/what-we-do/' },
    { name: 'Governance', url: '/governance/' },
    { name: 'Steering and Working Groups', url: '/#' },
    { name: 'Team', url: '/team/' },
    { name: 'Job Opportunities', url: '/job-opportunities/' },
    { name: 'Projects', url: '/projects/' }
  ],
  services_links: [
    { name: 'Create DOIs', url: '/create-dois/' },
    { name: 'Integrate Workflows', url: '/integrate-workflows/' },
    { name: 'Enable Discovery', url: '/enable-discovery/' },
    { name: 'Promote Reuse', url: '/promote-reuse/' },
    { name: 'Strategic Initiatives', url: '/#' }
  ],
  resources_links: [
    { name: 'Metadata Schema', url: 'https://schema.datacite.org' },
    { name: 'Support', url: 'https://support.datacite.org' }
  ],
  community_links: [
    { name: 'Become a Member', url: '/become-a-member/' },
    { name: 'DataCite Fee Model', url: '/fee-model/' },
    { name: 'Membership Enquiry', url: '/membership-enquiry/' },
    { name: 'DataCite Members', url: '/members/' }
  ],
  contact_links: [
    { name: 'Privacy Policy', url: '/privacy-policy/' },
    { name: 'Terms and Conditions', url: '/terms-and-conditions/' },
    { name: 'Imprint', url: '/imprint/' }

  ]
}


export default function Footer() {


  function StatusPage() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json())
    const { data, error } = useSWR(
      'https://nmtzsv0smzk5.statuspage.io/api/v2/status.json',
      fetcher
    )
    if (error)
      return (
        <a href="http://status.datacite.org" target="_blank" rel="noreferrer">
          <span className="color-dot critical"></span>
          <span className="color-description">Failed to load status</span>
        </a>
      )
    if (!data)
      return (
        <a href="http://status.datacite.org" target="_blank" rel="noreferrer">
          <span className="color-dot loading"></span>
          <span className="color-description">Loading...</span>
        </a>
      )

    return (
      <a href="http://status.datacite.org" target="_blank" rel="noreferrer">
        <span className={'color-dot ' + data.status.indicator}></span>
        <span className="color-description">{data.status.description}</span>
      </a>
    )
  }

  const baseUrl = 'https://datacite.org'

  const footerLinks = (links: { name: string, url: string }[]) => {
    return (
      <ul>
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.url.startsWith('/') ? baseUrl + link.url : link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <footer className="footer d-none d-sm-block">
      <Container>
        <Row>
          <Col sm={3} md={3} className="footer-column">
            <h4 data-cy="about">About Us</h4>
            {footerLinks(Links.about_links)}
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4>Work With Us</h4>
            {footerLinks(Links.services_links)}
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4>Membership</h4>
            {footerLinks(Links.community_links)}
            <h4>Resources</h4>
            {footerLinks(Links.resources_links)}
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4 className="share">Contact Us</h4>
            <a href="mailto:support@datacite.org" className="share">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a href="https://datacite.org/blog/" className="share">
              <FontAwesomeIcon icon={faBlog} />
            </a>
            <a href="https://github.com/datacite/datacite" className="share">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://twitter.com/datacite" className="share">
              <svg aria-hidden="true" focusable="false" data-prefix="fab" className="svg-inline--fa fa-twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
            </a>
            <a href="https://openbiblio.social/@datacite" className="share">
              <FontAwesomeIcon icon={faMastodon} />
            </a>
            <a
              href="https://www.linkedin.com/company/datacite"
              className="share"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              href="https://www.youtube.com/@DataCiteChannel"
              className="share"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            {footerLinks(Links.contact_links)}
            {StatusPage()}
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
