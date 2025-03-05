'use client'

import React from 'react'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import styles from './RepositoryDetail.module.scss'
import { MetricsDisplay } from 'src/components/MetricsDisplay/MetricsDisplay';
import { Repository } from 'src/data/types';
import { RepositoryDashboard } from 'src/components/RepositoryDetail/RepositoryDashboard'
import { useRepositoryRelatedContent } from 'src/data/queries/repositoryRelatedContentQuery'

type Props = {
  repo: Repository
}

export function RepositorySidebar({ repo }: Props) {
  const { data } = useRepositoryRelatedContent(repo.clientId)

  const gotoButtons = () => {
    return (
      <>
        {repo.url && (
          <Button id="go-to-repo" variant="default" href={repo.url} className="mb-2">
            <FontAwesomeIcon icon={faSignInAlt} />
            &nbsp;
            Go to Repository
          </Button>
        )}
        {data && (data.works.totalCount > 0) && (
          <Button variant="primary" href={"/doi.org?query=client.uid:" + repo.clientId} id="find-related">
            <FontAwesomeIcon icon={faNewspaper} />
            &nbsp;
            Find Related Works
          </Button>
        )}
      </>
    )
  }

  const contacts = () => {
    const contactsData = repo.contact.map((contact) => (
      {
        text: contact,
        link: contact.startsWith('http') ? contact : "mailto:" + contact
      }
    ));

    return (
      <>
        {(repo.contact?.length > 0) && (
          <>
            <h3 className="member-results">Contacts</h3>

            <ul className={styles.contactList}>
              {contactsData.map((contact, index) => (
                <li key={"contact-" + index}><a id={"contact-link-" + index} href={contact.link}>{contact.text}</a></li>
              ))}
            </ul>
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
    </>
  )

}


export function RepositoryDetail({ repo }: Props) {

  const { data } = useRepositoryRelatedContent(repo.clientId)
  const works = data?.works

  const tags = () => {
    if (repo.re3doi == null) return "";
    const keywordList = repo.keyword.map((kw) => (
      kw.toLowerCase()
    ))
    const subjectList = repo.subject.map((subject) => (
      subject.text.toLowerCase()
    ))
    return (
      <>
        {subjectList.map((keyword, index) => (
          <Badge key={"subject-" + index} bg="info">{keyword}</Badge>
        ))}
        {keywordList.map((keyword, index) => (
          <Badge key={"keyword-" + index} bg="info">{keyword}</Badge>
        ))}
      </>

    )
  }

  const advise = () => {
    return (
      <>
        {repo.url && (
          <>
            If you plan to deposit your research data in this repository,
            &nbsp;go to <a href={repo.url}>{repo.url}.</a>
          </>
        )}
      </>
    )
  }

  const extended_metadata = () => {
    if (repo.re3doi == null) return "";
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
    const mdList = metadata.map((field) => (
      <>
        <dt>{field.label}</dt>
        {(field.values.length == 0) && (<dd>none</dd>)}
        {field.values.map((value, index) => (
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
        <MetricsDisplay counts={{ works: works?.totalCount, citations: works?.citationCount, views: works?.viewCount, downloads: works?.downloadCount }} />
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
        <RepositoryDashboard repoId={repo.clientId} />
      </div>
      <div className={styles.advise}>
        {advise()}
      </div>
    </>
  )
}
