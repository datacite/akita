import React from 'react'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import styles from './RepositoryDetail.module.scss'
import { MetricsDisplay } from 'src/components/MetricsDisplay/MetricsDisplay';
import ShareLinks from 'src/components/ShareLinks/ShareLinks';
import { Repository } from 'src/data/types';
import { RepositoryDashboard } from 'src/components/RepositoryDetail/RepositoryDashboard'

type Props = {
  repo: Repository
}

export function RepositorySidebar({ repo }: Props) {
  const gotoButtons = () => {
    return (
      <>
        {repo.url && (
          <Button id="go-to-repo" variant="default" href={repo.url} className="w-100">
            <FontAwesomeIcon icon={faSignInAlt} />
            &nbsp;
            Go to Repository
          </Button>
        )}
        {repo.works && (repo.works.totalCount > 0) && (
          <Link href={"/doi.org?query=client.uid:" + repo.clientId}>
            <Button variant="primary" id="find-related">
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
      <div className={styles.share}>
        <ShareLinks url={"repositories/" + (repo.re3dataDoi ? repo.re3dataDoi : repo.id)} title={repo.name} />
      </div>
    </>
  )

}


export function RepositoryDetail({ repo }: Props) {



  const tags = () => {
    if (repo.re3dataDoi == null) return "";
    const keywordList = repo.keyword.map((kw) => (
      kw.toLowerCase()
    ))
    const subjectList = repo.subject.map((subject) => (
      subject.name.toLowerCase()
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
          <p>
            If you plan to deposit your research data in this repository,
            &nbsp;go to <a href={repo.url}>{repo.url}.</a>
          </p>
        )}
        <h5>More information about research data management</h5>

        <ol>
          <li>Borghi, J., Abrams, S., Lowenberg, D., Simms, S., & Chodacki, J.
            (2018). Support Your Data: A Research Data Management Guide for
            Researchers. Research Ideas and Outcomes, 4, e26439. <a
              href="https://doi.org/10.3897/rio.4.e26439">https://doi.org/10.3897/rio.4.e26439</a>
          </li>
          <li>Goodman, A., Pepe, A., Blocker, A. W., Borgman, C. L., Cranmer,
            K., Crosas, M., … Slavkovic, A. (2014). Ten Simple Rules for the
            Care and Feeding of Scientific Data. PLoS Computational Biology,
            10(4), e1003542.  <a href="https://doi.org/10.1371/journal.pcbi.1003542">https://doi.org/10.1371/journal.pcbi.1003542</a>
          </li>
          <li>Pampel, H., Vierkant, P., Scholze, F., Bertelmann, R., Kindling,
            M., Klump, J., … Dierolf, U. (2013). Making Research Data
            Repositories Visible: The re3data.org Registry. PLoS ONE, 8(11),
            e78080. <a
              href="https://doi.org/10.1371/journal.pone.0078080">https://doi.org/10.1371/journal.pone.0078080</a>
          </li>
        </ol>
      </>
    )
  }

  const extended_metadata = () => {
    if (repo.re3dataDoi == null) return "";
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
        <MetricsDisplay counts={{ works: repo.works.totalCount, citations: repo.citationCount, views: repo.viewCount, downloads: repo.downloadCount }} />
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


