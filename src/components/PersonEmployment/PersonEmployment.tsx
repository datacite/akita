import React from 'react'
import Link from 'next/link'

import { rorFromUrl } from '../../utils/helpers'
import { EmploymentRecord } from '../Person/Person'

type Props = {
  employment: EmploymentRecord
}

const PersonEmployment: React.FunctionComponent<Props> = ({ employment }) => {
  const name = () => {
    if (!employment.organizationId)
      return <h3 className="work">{employment.organizationName}</h3>

    return (
      <h3 className="work">
        <Link
          href="/ror.org/[...organization]"
          as={`/ror.org${rorFromUrl(employment.organizationId)}`}
        >
          <a>{employment.organizationName}</a>
        </Link>
      </h3>
    )
  }

  const range = () => {
    if (!employment.endDate)
      return (
        <div className="duration">
          Since{' '}
          {new Date(employment.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          })}
        </div>
      )

    return (
      <div className="duration">
        {new Date(employment.startDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })}{' '}
        to{' '}
        {new Date(employment.endDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })}
      </div>
    )
  }

  return (
    <div className="panel-body">
      {name()}
      {employment.roleTitle && (
        <div className="role-title">{employment.roleTitle}</div>
      )}
      {employment.startDate && range()}
    </div>
  )
}

export default PersonEmployment
