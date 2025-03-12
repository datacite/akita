import React from 'react'
import Link from 'next/link'
import startCase from 'lodash/startCase'

import { orcidFromUrl } from '../../utils/helpers'
import { rorFromUrl } from '../../utils/helpers'

export interface Person {
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

  if (person.id && person.id.startsWith('https://orcid.org/0'))
    return (
      <>
        <h4 className="work">
          <Link prefetch={false} href={'/orcid.org/' + orcidFromUrl(person.id)}>
            {name}
          </Link>
        </h4>
        {(person.affiliation?.length || 0) > 0 && (
          <>
            <div className="affiliations">
              {person.affiliation?.map((item) =>
                item.id ? (
                  <div className="affiliation" key={item.id}>
                    <Link prefetch={false} href={'/ror.org' + rorFromUrl(item.id)}>
                        {item.name}
                    </Link>
                  </div>
                ) : (
                  <div className="affiliation" key={item.name}>{item.name}</div>
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

  if (person.id && person.id.startsWith('https://ror.org/0'))
    return (
      <>
        <h4 className="work">
          <Link prefetch={false} href={'/ror.org' + rorFromUrl(person.id)}>
            {name}
          </Link>
        </h4>
        {(person.affiliation?.length || 0) > 0 && (
          <>
            <div className="affiliations">
              {person.affiliation?.map((item) =>
                item.id ? (
                  <div className="affiliation" key={item.id}>
                    <Link prefetch={false} href={'/ror.org' + rorFromUrl(item.id)}>
                        {item.name}
                    </Link>
                  </div>
                ) : (
                  <div className="affiliation" key={item.name}>{item.name}</div>
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
      {(person.affiliation?.length || 0) > 0 && (
        <>
          <div className="affiliations">
            {person.affiliation?.map((item) =>
              item.id ? (
                <div className="affiliation" key={item.id}>
                  <Link href={'/ror.org' + rorFromUrl(item.id)}>
                      {item.name}
                  </Link>
                </div>
              ) : (
                <div className="affiliation" key={item.name}>{item.name}</div>
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
