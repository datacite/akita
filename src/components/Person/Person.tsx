'use client'

import React from 'react'
import Image from 'next/image'
import heroImage from '../../../public/images/hero.svg'
import unlockImage from '../../../public/images/unlock.svg'
import scienceImage from '../../../public/images/science.svg'
import { Alert, Row, Col } from 'react-bootstrap'

import { Person as PersonType } from 'src/data/types'
import PersonMetadata from 'src/components/PersonMetadata/PersonMetadata'
import PersonEmployment from 'src/components/PersonEmployment/PersonEmployment'
import { pluralize } from 'src/utils/helpers'

type Props = {
  person: PersonType
}

export default function Person({ person }: Props) {
  if (!person) return <Alert variant="warning">No person found.</Alert>

  let has_open_access_software = false;
  let has_open_access_paper = false;
  let has_open_access_dataset = false;
  person.totalWorks.openLicenseResourceTypes.forEach(
    (v) => {
      if (v.id == "software" && v.count > 0) {
        has_open_access_software = true
      }

      if (v.id == "dataset" && v.count > 0) {
        has_open_access_dataset = true
      }

      if ((v.id == "text" || v.id == "journalarticle") && v.count > 0) {
        has_open_access_paper = true
      }
    }
  )

  const open_license_count = person.totalWorks.totalOpenLicenses

  const is_open_hero = open_license_count == person.totalWorks.totalCount && person.totalWorks.totalCount > 0
  const is_open_license = open_license_count > 0
  const is_os_triathlete = has_open_access_software && has_open_access_paper && has_open_access_dataset
  const is_open_access = person.totalWorks.totalContentUrl > 0

  const percentage_open_license = Math.round((open_license_count / person.totalWorks.totalCount) * 100)
  const percentage_open_url = Math.round((person.totalWorks.totalContentUrl / person.totalWorks.totalCount) * 100)

  const workCount = () => {
    if (person.citationCount + person.viewCount + person.downloadCount === 0) {
      return <div></div>
    }

    return (
      <>
        <Row><Col>
          <h3 className="member-results">Aggregated Citations, Views and Downloads</h3>
        </Col></Row>

        <Row>
          {person.citationCount > 0 && (
            <Col xs={4} className="text-center">
              <h4 className="work">{pluralize(person.citationCount, 'Citation')}</h4>
            </Col>
          )}
          {person.viewCount > 0 && (
            <Col xs={4} className="text-center">
              <h4 className="work">{pluralize(person.viewCount, 'View')}</h4>
            </Col>
          )}
          {person.downloadCount > 0 && (
            <Col xs={4} className="text-center">
              <h4 className="work">{pluralize(person.downloadCount, 'Download')}</h4>
            </Col>
          )}
        </Row>
      </>
    )
  }

  const accessAchievements = () => {
    if (!is_open_hero && !is_open_license && !is_open_access && !is_os_triathlete) return

    return (<>
      <Row><Col>
        <h3 className="member-results">Accessibility Achievements</h3>
      </Col></Row>

      {is_open_hero && <Achievement
        image={heroImage}
        text="Every single one of your publications is free to access online. Open access helps real people, and that's pretty heroic."
        alt="Superhero by tulpahn from the Noun Project"
      />}

      {is_open_license && <Achievement
        image={heroImage}
        text={`${percentage_open_license}% of the researcher's associated DOIs have metadata with rights as CC-BY, CC0 or public domain license.`}
        alt="Superhero by tulpahn from the Noun Project"
      />}

      {is_os_triathlete && <Achievement
        image={scienceImage}
        text="Congratulations, you hit the trifecta. You have an open access paper, open dataset, and open source software."
        alt="science education by Vectors Market from the Noun Project"
      />}

      {is_open_access && <Achievement
        image={unlockImage}
        text={`${percentage_open_url}% of your research is free to read online.`}
        alt="unlock by Alexandr Cherkinsky from the Noun Project"
      />}
    </>)
  }

  return (
    <>
      {/* <h3 className="member-results">{person.id}</h3> */}
      <PersonMetadata metadata={person} />
      {person.employment.length > 0 && (
        <h3 className="member-results" id="person-employment">Employment</h3>
      )}
      {person.employment.map((item) => (
        <div className="panel panel-transparent employment" key={item.organizationName}>
          <PersonEmployment employment={item} />
        </div>
      ))}
      {workCount()}

      {accessAchievements()}
    </>
  )
}


interface AchievementProps {
  image: any
  text: string
  alt: string
}

function Achievement(props: AchievementProps) {
  return <Row className='align-items-center mt-2'>
    <Col xs={1}>
      <Image
        src={props.image}
        width="74"
        height="74"
        title={props.alt}
        alt={props.alt}
      />
    </Col>
    <Col>{props.text}</Col>
  </Row>
}
