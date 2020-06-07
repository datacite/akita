import * as React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="row footer">
      <Grid fluid={true}>
        <Row>
          <Col sm={4} md={3} className="footer-column">
            <h4 data-cy="about">About DataCite</h4>
            <ul>
              <li><a href="https://www.datacite.org/mission.html">What we do</a></li>
              <li><a href="https://www.datacite.org/governance.html">Governance</a></li>
              <li><a href="https://www.datacite.org/steering.html">Steering groups</a></li>
              <li><a href="https://www.datacite.org/staff.html">Staff</a></li>
              <li><a href="https://www.datacite.org/jobopportunities.html">Job opportunities</a></li>
            </ul>
          </Col>
          <Col sm={4} md={3} className="footer-column">
            <h4>Services</h4>
            <ul>
              <li><a href="https://www.datacite.org/dois.html">Assign DOIs</a></li>
              <li><a href="https://www.datacite.org/search.html">Metadata search</a></li>
              <li><a href="https://www.datacite.org/eventdata.html">Event data</a></li>
              <li><a href="https://www.datacite.org/profiles.html">Profiles</a></li>
              <li><a href="https://www.datacite.org/re3data.html">re3data</a></li>
              <li><a href="https://www.datacite.org/citation.html">Citation formatter</a></li>
              <li><a href="https://www.datacite.org/stats.html">Statistics</a></li>
              <li><a href="https://www.datacite.org/content.html">Content negotiation</a></li>
              <li><a href="https://www.datacite.org/oaipmh.html">OAI-PMH</a></li>
            </ul>
          </Col>
          <Col sm={4} md={3} className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://schema.datacite.org">Metadata schema</a></li>
              <li><a href="https://support.datacite.org">Support</a></li>
            </ul>
            <h4>Community</h4>
            <ul>
              <li><a href="https://www.datacite.org/members.html">Members</a></li>
              <li><a href="https://www.datacite.org/partners.html">Partners</a></li>
              <li><a href="https://www.datacite.org/steering.html">Steering groups</a></li>
              <li><a href="https://www.datacite.org/events.html">Events</a></li>
              <li><a href="https://www.datacite.org/roadmap.html">Roadmap</a></li>
              <li><a href="https://www.datacite.org/user-stories.html">User Stories</a></li>
            </ul>
          </Col>
          <Col sm={4} md={3} className="footer-column">
            <h4 className="share">Contact Us</h4>
            <a href='mailto:support@datacite.org' className="share">
              <i className='fa fa-at'></i>
            </a>
            <a href='https://blog.datacite.org' className="share">
              <i className='fa fa-rss'></i>
            </a>
            <a href='https://twitter.com/datacite' className="share">
              <i className='fa fa-twitter'></i>
            </a>
            <a href='https://github.com/datacite/datacite' className="share">
              <i className='fa fa-github'></i>
            </a>
            <a href='https://www.linkedin.com/company/datacite' className="share">
              <i className='fa fa-linkedin'></i>
            </a>
            <ul className="share">
              <li><a href="https://www.datacite.org/terms.html">Terms and conditions</a></li>
              <li><a href="https://www.datacite.org/privacy.html">Privacy policy</a></li>
              <li><a href="https://www.datacite.org/acknowledgments.html">Acknowledgements</a></li>
            </ul>
            <a href="http://status.datacite.org" target="_blank" rel="noreferrer">
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
