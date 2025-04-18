import React from 'react'
import Table from 'react-bootstrap/Table'
import startCase from 'lodash/startCase'
import { Person } from 'src/components/WorkPerson/WorkPerson'
import Link from 'next/link'
import { rorFromUrl, orcidFromUrl } from 'src/utils/helpers'

type Props = {
  people: Person[]
}

const PersonTable: React.FunctionComponent<Props> = ({ people }) => {
  const personList = people.map((person) => {
    const link = person.id ?
      '/orcid.org/' + orcidFromUrl(person.id) : undefined;
    const personName = person.familyName ? [person.givenName, person.familyName].join(' ') : person.name
    const personLink = link ? <Link href={link}>{personName}</Link> : personName;
    const affiliations = person.affiliation?.map((item) => {
      return item.id && item.id.startsWith('https://ror.org/') ? (
        <Link key={item.id} href={'/ror.org' + rorFromUrl(item.id)}>
          {item.name}
        </Link>
      ) : (
        <div key={item.name}>{item.name}</div>
      )
    });
    return {
      name: personName,
      id: person.id,
      nameLink: personLink,
      contributorType: person.contributorType,
      affiliation: affiliations
    }
  });

  return (
    <Table striped>
      <tbody className="person-table">
        {personList.map((person, i) => {

          return <tr key={'person-' + i}>
            <td>{person.nameLink}</td>
            <td>{person.affiliation}</td>
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
