'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

import { MetricsDisplay } from 'src/components/MetricsDisplay/MetricsDisplay';
import { Repository } from 'src/data/types';
import { useRepositoryRelatedContentQuery } from 'src/data/queries/repositoryRelatedContentQuery'
import { SummaryStatsLoader } from '../SummarySearchMetrics/SummarySearchMetrics'
import styles from './RepositoryDetail.module.scss'

type Props = {
  repo: Repository
}



export function RepositoryDetail({ repo }: Props) {
  const { data, loading: worksLoading } = useRepositoryRelatedContentQuery({ clientId: repo.clientId })
  const works = data?.works

  function Metrics() {
    if (!repo.clientId) return
    if (worksLoading) return <SummaryStatsLoader />

    return <MetricsDisplay counts={{
      works: works?.totalCount,
      citations: works?.citationCount,
      views: works?.viewCount,
      downloads: works?.downloadCount
    }} />
  }

  function Tags() {
    if (repo.re3doi == null) return "";

    const keywordList = repo.keyword.map(kw => kw.toLowerCase())
    const subjectList = repo.subject.map(subject => subject.text.toLowerCase())

    return <>
      {subjectList.map((keyword, index) => (
        <Badge pill key={"subject-" + index} bg="info">{keyword}</Badge>
      ))}
      {keywordList.map((keyword, index) => (
        <Badge pill key={"keyword-" + index} bg="info">{keyword}</Badge>
      ))}
    </>
  }

  function Advise() {
    if (!repo.url) return null

    return <p className="my-4 p-3 d-grid border border-success">
      If you plan to deposit your research data in this repository, go to <a href={repo.url}>{repo.url}.</a>
    </p>
  }

  return <Row className="gap-4">
    <Col xs={12}><Metrics /></Col>
    <Col xs={12}>{repo.description}</Col>
    <Col xs={12}><Tags /></Col>
    <Col xs={12}><Advise /></Col>
  </Row>
}
