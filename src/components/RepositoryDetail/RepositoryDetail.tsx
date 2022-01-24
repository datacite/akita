import React from 'react'
import Link from 'next/link'
import { Button, Label } from 'react-bootstrap';
import { gql } from '@apollo/client'
import {FACET_FIELDS, Facet} from '../FacetList/FacetList'
import VerticalBarChart from '../VerticalBarChart/VerticalBarChart'
import DonutChart, { typesRange, typesDomain } from '../DonutChart/DonutChart'
import ProductionChart from '../ProductionChart/ProductionChart'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { faEnvelope, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import { compactNumbers } from '../../utils/helpers'
import {
  RepositoriesNode,
  REPOSITORY_FIELDS,
}from '../RepositoryMetadata/RepositoryMetadata'
import styles from './RepositoryDetail.module.scss'

export const REPOSITORY_DETAIL_FIELDS = gql`
  ${REPOSITORY_FIELDS}
  ${FACET_FIELDS}
  fragment repositoryDetailFields on Repository{
    ...repoFields
    citationCount
    downloadCount
    viewCount
    re3dataId
    re3data{
      id
      name
      contacts
      keywords
      pidSystems
      providerTypes

      dataUploads{
        type
      }

      dataAccesses {
        type
      }
      certificates {
        name
      }
      subjects {
        name
      }
    }
    works {
      totalCount
      languages{...facetFields}
      resourceTypes{...facetFields}
      fieldsOfScience{...facetFields}
      authors{...facetFields}
      licenses{...facetFields}
      published{...facetFields}
    }
  }
`
export interface TextRestriction {
  type: string
}
export interface DefinedTerm {
  name: string
}
export interface RepositoryRe3Data {
  id: string
  contacts: [string]
  keywords: string
  pidSystems: [string]
  providerTypes: [string]
  dataUploads: [TextRestriction]
  dataAccesses: [TextRestriction]
  certificates: [DefinedTerm]
  subjects: [DefinedTerm]
}
export interface RepositoryWorks {
  totalCount: number
  languages: [Facet]
  resourceTypes: [Facet]
  fieldsOfScience: [Facet]
  authors: [Facet]
  licenses: [Facet]
  published: [Facet]
}


export interface RepositoryDetailNode extends RepositoriesNode{
  citationCount: number
  downloadCount: number
  viewCount: number
  works: RepositoryWorks
  re3data: RepositoryRe3Data
}

type Props = {
  repo: RepositoryDetailNode
}

function facetToData(facetList){
  return facetList.map((x) => ({
    title: x.title,
    count: x.count
  }))
}


const pageInfo = (repo) => {
  const title = repo.name
    ? 'DataCite Commons: ' + repo.name
    : 'DataCite Commons: No Name'
  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
    ? 'https://commons.datacite.org/repositories/' + repo.id
    : 'https://commons.stage.datacite.org/repositories/' + repo.id

  const imageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
    ? 'https://commons.datacite.org/images/logo.png'
    : 'https://commons.stage.datacite.org/images/logo.png'
  return {
    'title': title,
    'pageUrl': pageUrl,
    'imageUrl': imageUrl
  }
}

export const RepositoryHeaderInfo: React.FunctionComponent<Props> = ({
  repo
}) => {
    const info = pageInfo(repo);
    return (
      <>
          <title>{info.title}</title>
          <meta name="og:title" content={info.title} />
          <meta name="og:url" content={info.pageUrl} />
          <meta name="og:image" content={info.imageUrl} />
          <meta name="og:type" content="organization" />
      </>
    )

  }

export const RepositorySidebar: React.FunctionComponent<Props> = ({
  repo
}) => {
  const gotoButtons = () => {
    return (
      <>
        { repo.url && (
          <Button block href={repo.url}>
              <FontAwesomeIcon icon={faSignInAlt} />
              &nbsp;
              Go to Repository
            </Button>
        )}
      { repo.works && (repo.works.totalCount>0) && (
          <Link href={"/doi.org?query=client.uid:" + repo.id}>
          <Button block bsStyle="primary">
              <FontAwesomeIcon icon={faNewspaper} />
              &nbsp;
              Find Related Works
            </Button>
          </Link>
        )}
      </>
    )
  }

  const contacts = () => {
    if (repo.re3data == null) return "";

    const contactsData = repo.re3data.contacts.map((contact) => (
      {
        text: contact,
        link: contact.startsWith('http')? contact: "mailto:"+contact
      }
    ));

    return (
      <>
      { (repo.re3data && repo.re3data.contacts) && (
        <>
        <h3>Contacts</h3>
        { contactsData.map((contact, index) => (
          <a key={"contact-"+ index} href={contact.link}>{contact.text}</a>
        ))}

      </>
      )}
    </>
    )
  }

  const shareDisplay = () => {
    const info = pageInfo(repo);
    return (
      <>
        <h3>Share</h3>
        <EmailShareButton url={info.pageUrl} title={info.title}>
          <FontAwesomeIcon icon={faEnvelope} /> Email
        </EmailShareButton>
        <TwitterShareButton url={info.pageUrl} title={info.title}>
          <FontAwesomeIcon icon={faTwitter} /> Twitter
        </TwitterShareButton>
        <FacebookShareButton url={info.pageUrl} title={info.title}>
          <FontAwesomeIcon icon={faFacebook} /> Facebook
        </FacebookShareButton>
      </>
    )
  }
  return (
    <>
        <div className={styles.gotoButtons}>
          {gotoButtons()}
        </div>
        <div className={styles.contacts}>
          {contacts()}
        </div>
        <div className={styles.share}>
          {shareDisplay()}
        </div>
      </>
    )

}
export const RepositoryDetail: React.FunctionComponent<Props> = ({
  repo
}) => {



  const dashboard = () => {
    return (
      <>
      <h3>{compactNumbers(repo.works.totalCount)} Deposits</h3>

      <div className={styles.grid}>
        <ProductionChart 
          title="Year of Publication"
          data={facetToData(repo.works.published)}
        />
        <DonutChart
          data={facetToData(repo.works.resourceTypes)}
          count={repo.works.totalCount}
          legend={false}
          title="Deposit Type"
          range={typesRange}
          domain={typesDomain}
        />
        <VerticalBarChart title="Top Depositors" data={repo.works.authors} />
        <VerticalBarChart title="Fields of Science" data={repo.works.fieldsOfScience} />
        <VerticalBarChart title="Deposit Languages" data={repo.works.languages} />
        <VerticalBarChart title="Deposit Licenses" data={repo.works.licenses} />
      </div>
      </>
    )
  }

  const tags = () => {
    if (repo.re3data == null) return "";
    const keywordList = repo.re3data.keywords.toLowerCase().split(", ")
    const subjectList = repo.re3data.subjects.map((subject) => (
      subject.name.toLowerCase()
    ))
    return (
      <>
        { subjectList.map((keyword, index) => (
          <Label key={"subject-" + index} bsStyle="info">{keyword}</Label>
        ))}
        { keywordList.map((keyword, index) => (
          <Label key={"keyword-" + index} bsStyle="info">{keyword}</Label>
        ))}
      </>

    )
  }

  const advise = () => {
    return (
      <>
        { repo.url && (
          <p>
            If you plan to deposit your research data in this repository, 
            &nbsp; go to <a href={repo.url}>{repo.url}.</a>
          </p>
        )}
        <h5>More information about research data management</h5>

        <ol>
          <li>Borghi, J., Abrams, S., Lowenberg, D., Simms, S., & Chodacki, J.
            (2018). Support Your Data: A Research Data Management Guide for
            Researchers. Research Ideas and Outcomes, 4, e26439. <a
            href="https://doi.org/10.3897/rio.4.e26439">https://doi.org/10.3897/rio.4.e26439</a>
          </li>
          <li>Goodman, A., Pepe, A., Blocker, A. W., Borgman, C. L., Cranmer,
            K., Crosas, M., … Slavkovic, A. (2014). Ten Simple Rules for the
            Care and Feeding of Scientific Data. PLoS Computational Biology,
            10(4), e1003542.  <a href="https://doi.org/10.1371/journal.pcbi.1003542">https://doi.org/10.1371/journal.pcbi.1003542</a>
          </li>
          <li>Pampel, H., Vierkant, P., Scholze, F., Bertelmann, R., Kindling,
            M., Klump, J., … Dierolf, U. (2013). Making Research Data
            Repositories Visible: The re3data.org Registry. PLoS ONE, 8(11),
            e78080. <a
            href="https://doi.org/10.1371/journal.pone.0078080">https://doi.org/10.1371/journal.pone.0078080</a>
          </li>
        </ol>
      </>
    )
  }
  const re3DataURL = () => {
    return `https://doi.org/${repo.re3dataId}`
  }
  const extended_metadata = () => {
    if (repo.re3data == null) return "";
    const metadata = [
      {
        label: "Data Access",
        values: repo.re3data.dataAccesses.map((term) => (
          term.type
        ))
      },
      {
        label: "Persistent Identifier",
        values: repo.re3data.pidSystems
      },
      {
        label: "Certificates",
        values: repo.re3data.certificates.map((term) => (
          term.name
        ))
      },
      {
        label: "Data Upload",
        values: repo.re3data.dataUploads.map((term) => (
          term.type
        ))
      },
      {
        label: "Provider Type",
        values: repo.re3data.providerTypes
      },
    ]
    const mdList = metadata.map( (field) => (
      <>
          <dt>{field.label}</dt>
          {(field.values.length ==0)&& (<dd>none</dd>)}
          {field.values.map( (value, index) => (
            <dd key={"metadata-" + field.label + index}>{value}</dd>
          ))}
      </>
    ))
    return (
      <dl>
        {mdList}
      </dl>
    )
  }

  const metricsDisplay = () => {
    const metricsData = [
      {
        "label": "Deposits",
        "count": repo.works.totalCount
      },
      {
        "label": "Citations",
        "count": repo.citationCount
      },
      {
        "label": "Views",
        "count": repo.viewCount
      },
      {
        "label": "Downloads",
        "count": repo.downloadCount
      }
    ];

    const metricList = metricsData.map( (metric) => 
    <>
      {metric.count>0 &&(
        <>
          <dt>{metric.label}</dt>
          <dd>{compactNumbers(metric.count)}</dd>
        </>
      )}
      </>
    )
    return (
        <div className={styles.metrics}>
          <dl>
            {metricList}
          </dl>
        </div>
    )
  }

  return (
    <>
      <div className={styles.header}>
        <h3>{repo.name}</h3>
        {metricsDisplay()}
      </div>
      <div className={styles.metadata}>
        <div className={styles.mdmain}>{repo.description}</div>
        <div className={styles.mdsidebar}>
          {extended_metadata()}
        </div>
      </div>
      <div className={styles.tags}>
        {tags()}
      </div>
      <div className={styles.dashboard}>
        {dashboard()}
      </div>
      <div className={styles.advise}>
        {advise()}
      </div>
    </>
  )
}


