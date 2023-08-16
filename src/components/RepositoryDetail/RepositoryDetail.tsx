import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Button, Label } from 'react-bootstrap';
import { gql } from '@apollo/client'
import {FACET_FIELDS, Facet} from '../FacetList/FacetList'
import VerticalBarChart from '../VerticalBarChart/VerticalBarChart'
import ProductionChart from '../ProductionChart/ProductionChart'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import { compactNumbers } from '../../utils/helpers'
import {
  RepositoriesNode,
  REPOSITORY_FIELDS,
}from '../RepositoryMetadata/RepositoryMetadata'
import styles from './RepositoryDetail.module.scss'
import { MetricsDisplay } from '../MetricsDisplay/MetricsDisplay';
import ShareLinks from '../ShareLinks/ShareLinks';
import { resourceTypeDomain, resourceTypeRange } from 'src/data/color_palettes';
import HorizontalStackedBarChart, { getTopFive, toBarRecord } from '../HorizontalStackedBarChart/HorizontalStackedBarChart';

export const REPOSITORY_DETAIL_FIELDS = gql`
  ${REPOSITORY_FIELDS}
  ${FACET_FIELDS}
  fragment repositoryDetailFields on Repository{
    ...repoFields
    citationCount
    downloadCount
    viewCount
    contact
    keyword
    pidSystem
    providerType
    dataUpload{
      type
    }
    dataAccess {
      type
    }
    certificate
    subject {
      name
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

export interface RepositoryWorks {
  totalCount: number
  languages: Facet[]
  resourceTypes: Facet[]
  fieldsOfScience: Facet[]
  authors: Facet[]
  licenses: Facet[]
  published: Facet[]
}

export interface RepositoryDetailNode extends RepositoriesNode{
  citationCount: number
  downloadCount: number
  viewCount: number
  works: RepositoryWorks
  contact: string[]
  pidSystem: string[]
  providerType: string[]
  dataUpload: TextRestriction[]
  dataAccess: TextRestriction[]
  certificate: string[]
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
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
    ? 'https://commons.datacite.org/'
    : 'https://commons.stage.datacite.org/'

  const pageUrl = repo.re3dataDoi
    ? baseUrl + "repositories/" + repo.re3dataDoi
    : baseUrl + "repositories/" + repo.id

  const imageUrl = baseUrl + "images/logo.png"
  return {
    'title': title,
    'pageUrl': pageUrl,
    'imageUrl': imageUrl
  }
}

export const RepositoryHeadInfo: React.FunctionComponent<Props> = ({
  repo
}) => {
    const info = pageInfo(repo);
    return (
      <Head>
          <title>{info.title}</title>
          <meta name="og:title" content={info.title} />
          <meta name="og:url" content={info.pageUrl} />
          <meta name="og:image" content={info.imageUrl} />
          <meta name="og:type" content="repository" />
      </Head>
    )

  }

export const RepositorySidebar: React.FunctionComponent<Props> = ({
  repo
}) => {
  const gotoButtons = () => {
    return (
      <>
        { repo.url && (
          <Button id="go-to-repo" block href={repo.url}>
              <FontAwesomeIcon icon={faSignInAlt} />
              &nbsp;
              Go to Repository
            </Button>
        )}
      { repo.works && (repo.works.totalCount>0) && (
          <Link href={"/doi.org?query=client.uid:" + repo.clientId}>
          <Button block bsStyle="primary" id="find-related">
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
    const contactsData = repo.contact.map((contact) => (
      {
        text: contact,
        link: contact.startsWith('http')? contact: "mailto:"+contact
      }
    ));

    return (
      <>
        { (repo.contact?.length > 0) && (
        <>
        <h3 className="member-results">Contacts</h3>
        <div className="panel panel-transparent share">
          <div className="panel-body">
            { contactsData.map((contact, index) => (
              <a id={"contact-link-"+ index} key={"contact-"+ index} href={contact.link}>{contact.text}</a>
            ))}
          </div>
        </div>
      </>
      )}
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
          <ShareLinks url={"repositories/" + (repo.re3dataDoi ? repo.re3dataDoi: repo.id)} title={repo.name} />
        </div>
      </>
    )

}
export const RepositoryDetail: React.FunctionComponent<Props> = ({
  repo
}) => {


  const dashboard = () => {
    if(repo.works.totalCount<1){
      return (<></>)
    }

    const works = getTopFive(repo.works.resourceTypes.map(toBarRecord))

    return (
      <>
      <h3>{compactNumbers(repo.works.totalCount)} Works</h3>

      <div className={styles.grid}>
        <ProductionChart
          title="Year of Publication"
          data={facetToData(repo.works.published)}
        />
        <HorizontalStackedBarChart
            chartTitle={'Work Types'}
            topCategory={{ title: works.topCategory, percent: works.topPercent}}
            data={facetToData(repo.works.resourceTypes)}
            domain={resourceTypeDomain}
            range={resourceTypeRange}
            tooltipText={'The field resourceType from DOI metadata was used to generate this chart.'} />
        <VerticalBarChart title="Top Depositors" data={repo.works.authors} />
        <VerticalBarChart title="Fields of Science" data={repo.works.fieldsOfScience} />
        <VerticalBarChart title="Work Languages" data={repo.works.languages} />
        <VerticalBarChart title="Work Licenses" data={repo.works.licenses} />
      </div>
      </>
    )
  }

  const tags = () => {
    if (repo.re3dataDoi == null) return "";
    const keywordList = repo.keyword.map((kw) => (
      kw.toLowerCase()
    ))
    const subjectList = repo.subject.map((subject) => (
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
            &nbsp;go to <a href={repo.url}>{repo.url}.</a>
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

  const extended_metadata = () => {
    if (repo.re3dataDoi == null) return "";
    const metadata = [
      {
        label: "Data Access",
        values: repo.dataAccess.map((term) => (
          term.type
        ))
      },
      {
        label: "Persistent Identifier",
        values: repo.pidSystem
      },
      {
        label: "Certificates",
        values: repo.certificate
      },
      {
        label: "Data Upload",
        values: repo.dataUpload.map((term) => (
          term.type
        ))
      },
      {
        label: "Provider Type",
        values: repo.providerType
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

  return (
    <>
      <div className={styles.header}>
        <h3>{repo.name}</h3>
        <MetricsDisplay counts={{ works: repo.works.totalCount, citations: repo.citationCount, views: repo.viewCount, downloads: repo.downloadCount }} />
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


