import * as React from 'react'
import Head from 'next/head'
import { Navbar, Nav, NavItem, Grid, Row, Col } from 'react-bootstrap'
import VegaBarChart from './line.js'
import BarChartRecharts from './bar.js';


type Props = {
  title?: string
}

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'DataCite DOI Search',
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600" rel="stylesheet" />
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" rel="stylesheet" type='text/css' />
      <link href="https://assets.datacite.org/stylesheets/doi.css?version=3.8.0" rel='stylesheet' type='text/css' />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Head>
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">{title}</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
        <NavItem eventKey={1} href="/about">
          About
        </NavItem>
        <NavItem eventKey={2} href="https://support.datacite.org/">
          Support
      </NavItem>
      </Nav>
    </Navbar>

    {children}

    <footer className="row footer">

    <Row
            className="uk-margin-bottom"
            title="Vega"
          >
            <section className="demo demo-nivo uk-margin-bottom">
              <VegaBarChart />
            </section>
          </Row>


          <Row
            className="uk-margin-bottom"
            title="Recharts"
          >
            <section className="demo demo-recharts uk-margin-bottom">
              <BarChartRecharts />
            </section>
          </Row>
      <Grid fluid={true}>
        <Row>
          <Col sm={4} md={3} className="footer-column">
            <h4>About DataCite</h4>
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

    <style jsx global>{`
        .carousel-inner {
            background-color: white;
        }
        .carousel-indicators li {
            background-color: #a3acb2;
        }
      `}</style>
  </div>
)

export default Layout
