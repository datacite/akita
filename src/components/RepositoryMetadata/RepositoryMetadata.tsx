import React from 'react'
import Link from 'next/link'
import { Label, Col, Row } from 'react-bootstrap'
import truncate from 'lodash/truncate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export interface RepositoriesNode {
  id: string
  re3dataId: string
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

  const re3DataURL = () => {
    return "https://doi.org/" + repo.re3dataId
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
        { (repo.url || repo.re3dataId) && (
          <>
            { repo.re3dataId && (
              <div>
                <a href={re3DataURL()}>
                  More info about {repo.name} Repository</a>
              </div>
            )}
            {repo.url && (
              <div>
                <a href={repo.url}>Go to {repo.name} Repository</a>
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
        <h3>{repo.name}</h3>
        {description()}
        <div className="description">{truncate(repo.description, 250)}</div>
        {tags()}
        {links()}
      </div>
    </div>
  )
}

export default RepositoryMetadata
