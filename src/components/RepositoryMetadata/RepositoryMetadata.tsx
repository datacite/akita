import React from 'react'
import Link from 'next/link'
import { Label, Col, Row } from 'react-bootstrap'
import truncate from 'lodash/truncate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'


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


  return (
            <div key={repo.id} className="panel panel-transparent">
              <div className="panel-body">
                <h3>{repo.name}</h3>
                <div className="description">{repo.description}</div>
                {tags()}
                { (repo.url || repo.re3dataId) && (
                  <>
                    { repo.re3dataId && (
                      <div>

                        <a href={"https://re3data.org/repository/" + repo.re3dataId}>
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
              </div>
            </div>
  )
}

export default RepositoryMetadata
