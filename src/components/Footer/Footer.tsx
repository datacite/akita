import React from 'react'
import useSWR from 'swr'
import { Grid, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faBlog } from '@fortawesome/free-solid-svg-icons'
import {
  faLinkedin,
  faGithub,
  faTwitter,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'

// TODO import Links from yml file
// import Links from '../../../config/links.yml'

const Links = {
  about_links: [
    { name: 'What we do', url: '/value.html' },
    { name: 'Governance', url: '/governance.html' },
    { name: 'Members', url: '/members.html' },
    { name: 'Steering groups', url: '/steering.html' },
    { name: 'Staff', url: '/staff.html' },
    { name: 'Job opportunities', url: '/jobopportunities.html' }
  ],
  services_links: [
    { name: 'Assign DOIs', url: '/dois.html' },
    { name: 'Metadata search', url: '/governance.html' },
    { name: 'Event data', url: '/eventdata.html' },
    { name: 'Profiles', url: '/profiles.html' },
    { name: 're3data', url: '/re3data.html' },
    { name: 'Citation formatter', url: '/citation.html' },
    { name: 'Statistics', url: '/stats.html' },
    { name: 'Service status', url: '/service.html' },
    { name: 'Content negotiation', url: '/content.html' },
    { name: 'OAI-PMH', url: '/oaipmh.html' },
    { name: 'Test environment', url: '/test.html' }
  ],
  resources_links: [
    { name: 'Metadata schema', url: 'https://schema.datacite.org' },
    { name: 'Support', url: 'https://support.datacite.org' },
    { name: 'Fee Model', url: '/feemodel.html' }
  ],
  community_links: [
    { name: 'Members', url: '/members.html' },
    { name: 'Partners', url: '/partners.html' },
    { name: 'Steering groups', url: '/steering.html' },
    { name: 'Service providers', url: '/service-providers.html' },
    { name: 'Roadmap', url: '/roadmap.html' }
  ],
  contact_links: [
    { name: 'Imprint', url: '/imprint.html' },
    { name: 'Terms and conditions', url: '/terms.html' },
    { name: 'Privacy policy', url: '/privacy.html' }
  ]
}

const Footer = () => {
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

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://datacite.org'
      : 'https://www.stage.datacite.org'

  const footerLinks = (links) => {
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
    <footer className="row footer hidden-xs">
      <Grid fluid={true}>
        <Row>
          <Col sm={3} md={3} className="footer-column">
            <h4 data-cy="about">About DataCite</h4>
            {footerLinks(Links.about_links)}
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4>Services</h4>
            {footerLinks(Links.services_links)}
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4>Resources</h4>
            {footerLinks(Links.resources_links)}
            <h4>Community</h4>
            {footerLinks(Links.community_links)}
          </Col>
          <Col sm={3} md={3} className="footer-column">
            <h4 className="share">Contact Us</h4>
            <a href="mailto:support@datacite.org" className="share">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a href="https://blog.datacite.org" className="share">
              <FontAwesomeIcon icon={faBlog} />
            </a>
            <a href="https://twitter.com/datacite" className="share">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://github.com/datacite/datacite" className="share">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              href="https://www.youtube.com/channel/UCVsSDZhIN_WbnD_v5o9eB_A"
              className="share"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a
              href="https://www.linkedin.com/company/datacite"
              className="share"
            >
              <FontAwesomeIcon icon={faLinkedin} />
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
      </Grid>
    </footer>
  )
}

export default Footer
