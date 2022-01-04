import React from 'react'
import { gql } from '@apollo/client'
import {FACET_FIELDS, Facet} from '../FacetList/FacetList'
import VerticalBarChart from '../VerticalBarChart/VerticalBarChart'
import DonutChart, { typesRange, typesDomain } from '../DonutChart/DonutChart'

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

export const RepositoryDetail: React.FunctionComponent<Props> = ({
  repo
}) => {



  const gotoRepositoryButton = () => {
    return "GO TO REPOSTIORY"
  }

  const contacts = () => {
    return "CONTACTS"
  }

  const dashboard = () => {
    return (
      <>
      { repo.works.languages.length>0 && (
        <VerticalBarChart title="Deposit Language" data={repo.works.languages} />
      )}
      <DonutChart
        data={facetToData(repo.works.resourceTypes)}
        count={repo.works.totalCount}
        legend={false}
        title="Deposit Type"
        range={typesRange}
        domain={typesDomain}
      />
      { repo.works.fieldsOfScience.length>0 && (
      <VerticalBarChart title="Fields of Science" data={repo.works.fieldsOfScience} />
      )}
      { repo.works.authors.length>0 && (
      <VerticalBarChart title="Top Depositors" data={repo.works.authors} />
      )}
      { repo.works.licenses.length>0 && (
      <VerticalBarChart title="Deposit Licenses" data={repo.works.licenses} />
      )}
      { repo.works.published.length>0 && (
      <VerticalBarChart title="Year of Publication" data={repo.works.published}/>
      )}
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
              or contact the repository for more information via <a href={repo.url}>{repo.url}</a>
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


  const metrics = () => {
    return (
        <div className={styles.metrics}>
          <dl>
            <dt>Deposits</dt>
            <dd>{ repo.works.totalCount }</dd>
            <dt>Citations</dt>
            <dd>{repo.citationCount}</dd>
            <dt>Views</dt>
            <dd>{repo.viewCount}</dd>
            <dt>Downloads</dt>
            <dd>{repo.downloadCount}</dd>
          </dl>
        </div>
    )
  }

  return (
    <>
        <h3>{repo.name}</h3>
        {metrics()}
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
        <div className={styles.contacts}>
          {contacts()}
        </div>
        <div className={styles.gotoRepositoryButton}>
          {gotoRepositoryButton()}
        </div>
      </>
  )
}


