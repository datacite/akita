import React from 'react'
import Link from 'next/link'
import startCase from 'lodash/startCase'

import { orcidFromUrl } from '../../utils/helpers'
import { rorFromUrl } from '../../utils/helpers'

interface Person {
  id: string
  name: string
  givenName?: string
  familyName?: string
  contributorType?: string
  affiliation?: Affiliation[]
}

interface Affiliation {
  id: string
  name: string
}

type Props = {
  person: Person
}

const WorkPerson: React.FunctionComponent<Props> = ({ person }) => {
  const name = person.familyName
    ? [person.givenName, person.familyName].join(' ')
    : person.name

  if (person.id && person.id.startsWith('https://orcid.org'))
    return (
      <>
        <h4 className="work">
          <Link
            href={'/orcid.org' + orcidFromUrl(person.id)}
          >
            <a>{name}</a>
          </Link>
        </h4>
        {person.affiliation.length > 0 && (
          <>
            <div className="affiliation">
              {person.affiliation.map((item) =>
                item.id ? (
                  <Link
                    href={'/ror.org' + rorFromUrl(item.id)}
                  >
                    <a>{item.name}</a>
                  </Link>
                ) : (
                  <div key={item.name}>{item.name}</div>
                )
              )}
            </div>
          </>
        )}
        {person.contributorType && (
          <div className="contributor-type">
            {startCase(person.contributorType)}
          </div>
        )}
      </>
    )

  if (person.id && person.id.startsWith('https://ror.org'))
    return (
      <>
        <h4 className="work">
          <Link
            href={'/ror.org' + rorFromUrl(person.id)}
          >
            <a>{name}</a>
          </Link>
        </h4>
        {person.affiliation.length > 0 && (
          <>
            <div className="affiliation">
              {person.affiliation.map((item) =>
                item.id ? (
                  <Link
                    href={'/ror.org' + rorFromUrl(item.id)}
                  >
                    <a>{item.name}</a>
                  </Link>
                ) : (
                  <div key={item.name}>{item.name}</div>
                )
              )}
            </div>
          </>
        )}
        {person.contributorType && (
          <div className="contributor-type">
            {startCase(person.contributorType)}
          </div>
        )}
      </>
    )

  return (
    <>
      <h4 className="work">{name}</h4>
      {person.affiliation.length > 0 && (
        <>
          <div className="affiliation">
            {person.affiliation.map((item) =>
              item.id ? (
                <Link
                  href={'/ror.org' + rorFromUrl(item.id)}
                >
                  <a>{item.name}</a>
                </Link>
              ) : (
                <div key={item.name}>{item.name}</div>
              )
            )}
          </div>
        </>
      )}
      {person.contributorType && (
        <div className="contributor-type">
          {startCase(person.contributorType)}
        </div>
      )}
    </>
  )
}

export default WorkPerson
