import React from 'react'
import { Table } from 'react-bootstrap'
import startCase from 'lodash/startCase'
import { Person } from '../WorkPerson/WorkPerson'
import Link from 'next/link'
import { rorFromUrl } from 'src/utils/helpers'

type Props = {
  people: Person[]
}

const PersonTable: React.FunctionComponent<Props> = ({ people }) => {
  return (
    <Table striped condensed>
      <tbody className="person-table">
        {people.map((person, i) => {
          const name = person.familyName
            ? [person.givenName, person.familyName].join(' ')
            : person.name
          
          return <tr key={'person-' + i}>
              <td>{name}</td>
              <td>{person.affiliation.map((item) =>
              item.id ? (
                <Link key={item.id} href={'/ror.org' + rorFromUrl(item.id)}>
                  <a>{item.name}</a>
                </Link>
              ) : (
                <div key={item.name}>{item.name}</div>
              )
            )}</td>
              {person.contributorType && (
                <td>
                  {startCase(person.contributorType)}
                </td>
              )}
            </tr>

        })}
      </tbody>
    </Table>
  )
}

export default PersonTable
