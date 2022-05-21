import React from 'react'
import { Label} from 'react-bootstrap'
import { gql } from '@apollo/client'
import truncate from 'lodash/truncate'
import Link from 'next/link'


export const REPOSITORY_FIELDS = gql`
  fragment repoFields on Repository{
        uid
        re3dataDoi
        name
        language
        description
        type
        repositoryType
        url
  }
`

export interface RepositoriesNode {
  uid: string
  re3dataDoi: string
  name: string
  language: string[]
  description: string
  type: string
  repositoryType: string[]
  url: string
}

type Props = {
  repo: RepositoriesNode
}

export const RepositoryMetadata: React.FunctionComponent<Props> = ({
  repo
}) => {

  const detailUrl = () => {
    return `/repositories/${repo.uid}`
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
    return (
      <div className="tags">
      {repo.language && (
        <span>
         { repo.language.map((lang, index) => (
             <Label key={index} bsStyle="info">{lang}</Label>
         ))}
        </span>
      )}
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
    <div key={repo.uid} className="panel panel-transparent">
      <div className="panel-body">
        <h3><Link href={detailUrl()}>
            <a>{repo.name}</a>
        </Link></h3>
        {description()}
        {tags()}
        {links()}
      </div>
    </div>
  )
}

export default RepositoryMetadata
