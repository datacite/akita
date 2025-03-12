'use client'
import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Loading from 'src/components/Loading/Loading'
import Error from 'src/components/Error/Error'
import { useRepositoryRelatedContent } from 'src/data/queries/repositoryRelatedContentQuery'
import VerticalBarChart from 'src/components/VerticalBarChart/VerticalBarChart'
import ProductionChart from 'src/components/ProductionChart/ProductionChart'
import HorizontalStackedBarChart from 'src/components/HorizontalStackedBarChart/HorizontalStackedBarChart';
import { resourceTypeDomain, resourceTypeRange, licenseRange, otherDomain, otherRange } from 'src/data/color_palettes';
import { compactNumbers, getTopFive, toBarRecord } from 'src/utils/helpers'
import styles from './RepositoryDetail.module.scss'


function facetToData(facetList) {
  return facetList.map((x) => ({
    title: x.title,
    count: x.count
  }))
}


interface Props {
  repoId: string
}

export function RepositoryDashboard({ repoId }: Props) {
  if (!repoId) return <></>

  const { data: repo, loading, error } = useRepositoryRelatedContent(repoId)

  if (loading) return <Row><Loading offset={false} /></Row>

  if (error) return (
    <Row>
      <Col md={{ span: 9, offset: 3 }}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )


  if (!repo || repo.works.totalCount < 1) {
    return <></>
  }

  const works = getTopFive(repo.works.resourceTypes.map(toBarRecord))
  const licenses = getTopFive(repo.works.licenses.map(toBarRecord))

  return (
    <>
      <h3>{compactNumbers(repo.works.totalCount)} Works</h3>

      <div className={styles.grid}>
        <ProductionChart
          title="Publication Year"
          data={facetToData(repo.works.published)}
        />
        <HorizontalStackedBarChart
          chartTitle={'Work Types'}
          topCategory={{ title: works.topCategory, percent: works.topPercent }}
          data={facetToData(repo.works.resourceTypes)}
          domain={resourceTypeDomain}
          range={resourceTypeRange}
          tooltipText={'The field resourceType from DOI metadata was used to generate this chart.'} />
        <HorizontalStackedBarChart
          chartTitle='Licenses'
          topCategory={{ title: licenses.topCategory, percent: licenses.topPercent }}
          data={licenses.data}
          domain={[...otherDomain, ...licenses.data.map(l => l.title)]}
          range={[...otherRange, ...licenseRange]}
          tooltipText={'The field "rights" from DOI metadata was used to generate this chart, showing the % of licenses used across works.'} />
        <VerticalBarChart title="Top Creators and Contributors" data={repo.works.creatorsAndContributors || []} />
        <VerticalBarChart title="Fields of Science" data={repo.works.fieldsOfScience} />
        <VerticalBarChart title="Work Languages" data={repo.works.languages} />
      </div>
    </>
  )
}
