import React from 'react'
import Link from 'next/link'

import { gridFromUrl } from '../../utils/helpers'
import { EmploymentRecord } from '../Person/Person'

type Props = {
  employment: EmploymentRecord
}

const PersonEmployment: React.FunctionComponent<Props> = ({ employment }) => {
  const name = () => {
    if (!employment.organizationId)
      return <h4 className="work">{employment.organizationName}</h4>

    return (
      <h4 className="work">
        <Link href={'/grid.ac' + gridFromUrl(employment.organizationId)}>
          {employment.organizationName}
        </Link>
      </h4>
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
