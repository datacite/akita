import React from 'react'
import { Badge } from 'react-bootstrap-4'
import truncate from 'lodash/truncate'
import Link from 'next/link'
import { Repository } from 'src/data/types'
import { Row, Col } from '../Layout-4'


type Props = {
  repo: Repository
}

function RepositoryMetadata({ repo }: Props) {

  const detailUrl = () => {
    return `/repositories/${repo.id}`
  }

  const re3DataURL = () => {
    return `https://doi.org/${repo.re3dataDoi}`
  }

  const description = () => {
    if (!repo.description) return ''

    const descriptionHtml = truncate(repo.description, {
      length: 2500,
      separator: '… '
    })

    return <div className="description">{descriptionHtml}</div>
  }

  const tags = () => {
    const keywordList = repo.keyword.map((kw) => (
      kw.toLowerCase()
    ))
    const subjectList = repo.subject.map((subject) => (
      subject.name.toLowerCase()
    ))
    return (
      <div className="tags">
        {subjectList.map((keyword, index) => (
          <Badge key={"subject-" + index} variant="info">{keyword}</Badge>
        ))}
        {keywordList.map((keyword, index) => (
          <Badge key={"keyword-" + index} variant="info">{keyword}</Badge>
        ))}
      </div>
    )
  }
  const links = () => {
    return (
      <>
        {(repo.url || repo.re3dataDoi) && (
          <>
            {repo.re3dataDoi && (
              <div>
                <a className="re3data-link" href={re3DataURL()}>
                  More info about {repo.name} Repository</a>
              </div>
            )}
            {repo.url && (
              <div>
                <a className="go-to-repository-link" href={repo.url}>Go to {repo.name} Repository</a>
              </div>
            )}
          </>
        )}
      </>
    )
  }

  return (
    <Row key={repo.id} className="panel panel-transparent">
      <Col className="panel-body">
        <h3 className="font-weight-bold"><Link href={detailUrl()}>
          {repo.name}
        </Link></h3>
        {description()}
        {tags()}
        {links()}
      </Col>
    </Row>
  )
}

export default RepositoryMetadata
