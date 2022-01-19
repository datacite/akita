import React from 'react'
import Link from 'next/link'
import { Button } from 'react-bootstrap';
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
  contacts: [string]
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


type ConditionaBarChartProps = {
  title: string,
  data: [Facet]
}
type ConditionaDonutChartProps = {
  title: string,
  count: number,
  data: [Facet]
}

type EmptyChartProps ={
  title: string
}

const EmptyChart: React.FunctionComponent<EmptyChartProps> = ({title}) => {
  return (
    <div className={`panel panel-transparent`}>
    <div className={`panel-body ${styles.emptyChart}`}>
      <div className={styles.title}>
        <h4>{title}</h4>
      </div>
      <div>No data available</div>
  </div>
  </div>
)
}

const ConditionalProductionChart: React.FunctionComponent<ConditionaBarChartProps> = ({title, data}) => {
  if (data.length>0){
    return <ProductionChart title={title} data={data} />
  }
  return <EmptyChart title={title} />
}

const ConditionalBarChart: React.FunctionComponent<ConditionaBarChartProps> = ({title, data}) => {
  if (data.length>0){
    return <VerticalBarChart title={title} data={data} />
  }
  return <EmptyChart title={title} />
}
const ConditionalDonutChart: React.FunctionComponent<ConditionaDonutChartProps> = ({title, data, count}) => {
  if (data.length>0){
    return <DonutChart
        data={data}
        count={count}
        legend={false}
        title={title}
        range={typesRange}
        domain={typesDomain}
      />
  }
  return <EmptyChart title={title} />
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
    return (
      <>
      { repo.contacts && (
        <h3>CONTACTS</h3>
      )}
    </>
    )
  }

  const shareDisplay = () => {
    const info = pageInfo(repo);
    return (
      <>
        <h3>SHARE</h3>
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

      <ConditionalBarChart title="Deposit Language" data={repo.works.languages} />

      <ConditionalDonutChart
        data={facetToData(repo.works.resourceTypes)}
        count={repo.works.totalCount}
        title="Deposit Type"
      />
      <ConditionalBarChart title="Fields of Science" data={repo.works.fieldsOfScience} />
      <ConditionalBarChart title="Top Depositors" data={repo.works.authors} />
      <ConditionalBarChart title="Deposit Licenses" data={repo.works.licenses} />
      <ConditionalProductionChart 
        title="Year of Publication"
        data={facetToData(repo.works.published)}
      />
      </>
    )
  }

  const tags = () => {
    return "TAGS"
  }

  const advise = () => {
    return (
      <>
        <p>
          If you plan to deposit your research data in this repository, 
          { repo.url && (
            <>
              &nbsp; go to <a href={repo.url}>{repo.url}</a>
            </>
          )}
          { repo.url && (
            <>
              &nbsp; or contact the repository for more information via <a href={repo.url}>{repo.url}</a>
            </>
          )}.
        </p>
        <h5>More information about research data management</h5>

        <ol>
          <li>Borghi, J., Abrams, S., Lowenberg, D., Simms, S., & Chodacki, J. (2018). Support Your Data: A Research Data Management Guide for Researchers. Research Ideas and Outcomes, 4, e26439. <a href="https://doi.org/10.3897/rio.4.e26439">https://doi.org/10.3897/rio.4.e26439</a></li>
          <li>Goodman, A., Pepe, A., Blocker, A. W., Borgman, C. L., Cranmer, K., Crosas, M., … Slavkovic, A. (2014). Ten Simple Rules for the Care and Feeding of Scientific Data. PLoS Computational Biology, 10(4), e1003542. <a href="https://doi.org/10.1371/journal.pcbi.1003542">https://doi.org/10.1371/journal.pcbi.1003542</a></li>
          <li>Pampel, H., Vierkant, P., Scholze, F., Bertelmann, R., Kindling, M., Klump, J., … Dierolf, U. (2013). Making Research Data Repositories Visible: The re3data.org Registry. PLoS ONE, 8(11), e78080. <a href="https://doi.org/10.1371/journal.pone.0078080">https://doi.org/10.1371/journal.pone.0078080</a></li>
        </ol>
      </>
    )
  }
  const re3DataURL = () => {
    return `https://doi.org/${repo.re3dataId}`
  }
  const extended_metadata = () => {
    if (repo.re3dataId) return `EXTENDED METADATA for ${re3DataURL()}`;
    return "NO EXTENDED METADATA"
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
          <dd>{metric.count}</dd>
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
        <h3>{repo.name}</h3>
        {metricsDisplay()}
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


