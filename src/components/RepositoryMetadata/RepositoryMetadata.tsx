import React from 'react'
import { Label} from 'react-bootstrap'
import { gql } from '@apollo/client'
import truncate from 'lodash/truncate'
import Link from 'next/link'


export const REPOSITORY_FIELDS = gql`
  fragment repoFields on Repository{
        id:uid
        re3dataDoi
        clientId
        name
        language
        keyword
        subject {
          name
        }
        description
        type
        repositoryType
        url
  }
`
export interface DefinedTerm {
  name: string
}

export interface RepositoriesNode {
  id: string
  re3dataDoi: string
  clientId: string
  name: string
  language: string[]
  description: string
  type: string
  repositoryType: string[]
  url: string
  keyword: string[]
  subject: DefinedTerm[]
}

type Props = {
  repo: RepositoriesNode
}

export const RepositoryMetadata: React.FunctionComponent<Props> = ({
  repo
}) => {

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
        { subjectList.map((keyword, index) => (
          <Label key={"subject-" + index} bsStyle="info">{keyword}</Label>
        ))}
        { keywordList.map((keyword, index) => (
          <Label key={"keyword-" + index} bsStyle="info">{keyword}</Label>
        ))}
      </div>
    )
  }
  const links = () => {
    return (
      <>
        { (repo.url || repo.re3dataDoi) && (
          <>
            { repo.re3dataDoi && (
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
    <div key={repo.id} className="panel panel-transparent">
      <div className="panel-body">
        <h3><Link href={detailUrl()}>
            {repo.name}
        </Link></h3>
        {description()}
        {tags()}
        {links()}
      </div>
    </div>
  );
}

export default RepositoryMetadata
