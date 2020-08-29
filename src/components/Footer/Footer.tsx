import * as React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faBlog } from '@fortawesome/free-solid-svg-icons'
import {
  faLinkedin,
  faGithub,
  faTwitter,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'
import CookieConsent from 'react-cookie-consent'

const Footer = () => {
  return (
    <footer className="row footer">
      <CookieConsent
        containerClasses="consent-cookie"
        location="bottom"
        buttonText="I accept"
        declineButtonText="I decline"
        sameSite="strict"
        cookieName="_consent"
        // extraCookieOptions={{ domain: "datacite.org" }}
        overlay={true}
        enableDeclineButton
      >
        This website uses cookies to enable important site functionality
        including analytics and personalization.{' '}
        <a
          href="https://datacite.org/privacy.html"
          target="_blank"
          rel="noreferrer"
        >
          Read our privacy policy
        </a>{' '}
      </CookieConsent>
      <Grid fluid={true}>
        <Row>
          <Col sm={4} md={3} className="footer-column">
            <h4 data-cy="about">About DataCite</h4>
            <ul>
              <li>
                <a href="https://datacite.org/mission.html">What we do</a>
              </li>
              <li>
                <a href="https://datacite.org/governance.html">
                  Governance
                </a>
              </li>
              <li>
                <a href="https://datacite.org/members.html">
                  Members
                </a>
              </li>
              <li>
                <a href="https://datacite.org/steering.html">
                  Steering groups
                </a>
              </li>
              <li>
                <a href="https://datacite.org/staff.html">Staff</a>
              </li>
              <li>
                <a href="https://datacite.org/jobopportunities.html">
                  Job opportunities
                </a>
              </li>
            </ul>
          </Col>
          <Col sm={4} md={3} className="footer-column">
            <h4>Services</h4>
            <ul>
              <li>
                <a href="https://datacite.org/dois.html">Assign DOIs</a>
              </li>
              <li>
                <a href="https://datacite.org/search.html">
                  Metadata search
                </a>
              </li>
              <li>
                <a href="https://datacite.org/eventdata.html">Event data</a>
              </li>
              <li>
                <a href="https://datacite.org/profiles.html">Profiles</a>
              </li>
              <li>
                <a href="https://datacite.org/re3data.html">re3data</a>
              </li>
              <li>
                <a href="https://datacite.org/citation.html">
                  Citation formatter
                </a>
              </li>
              <li>
                <a href="https://datacite.org/stats.html">Statistics</a>
              </li>
              <li>
                <a href="https://datacite.org/content.html">
                  Content negotiation
                </a>
              </li>
              <li>
                <a href="https://datacite.org/oaipmh.html">OAI-PMH</a>
              </li>
              <li>
              <a href="https://datacite.org/test.html">Test Environment</a>
            </li>
            </ul>
          </Col>
          <Col sm={4} md={3} className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="https://schema.datacite.org">Metadata schema</a>
              </li>
              <li>
                <a href="https://support.datacite.org">Support</a>
              </li>
              <li>
                <a href="https://datacite.org/feemodel.html">Fee Model</a>
              </li>
            </ul>
            <h4>Community</h4>
            <ul>
              <li>
                <a href="https://datacite.org/members.html">Members</a>
              </li>
              <li>
                <a href="https://datacite.org/partners.html">Partners</a>
              </li>
              <li>
                <a href="https://datacite.org/steering.html">
                  Steering groups
                </a>
              </li>
              <li>
                <a href="https://datacite.org/service-providers.html">Service Providers</a>
              </li>
              <li>
                <a href="https://datacite.org/roadmap.html">Roadmap</a>
              </li>
            </ul>
          </Col>
          <Col sm={4} md={3} className="footer-column">
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
            <ul className="share">
              <li>
                <a href="https://datacite.org/imprint.html">
                  Imprint
                </a>
              </li>
              <li>
                <a href="https://datacite.org/terms.html">
                  Terms and conditions
                </a>
              </li>
              <li>
                <a href="https://datacite.org/privacy.html">
                  Privacy policy
                </a>
              </li>
            </ul>
            <h4>Funding</h4>
            <ul>
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
            </ul>
            <a
              href="http://status.datacite.org"
              target="_blank"
              rel="noreferrer"
            >
              <span className="color-dot"></span>
              <span className="color-description"></span>
            </a>
          </Col>
        </Row>
      </Grid>
    </footer>
  )
}

export default Footer
