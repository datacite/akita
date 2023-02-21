import React from 'react'
import { Table } from 'react-bootstrap'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import startCase from 'lodash/startCase'
import { Person } from '../WorkPerson/WorkPerson'
import Link from 'next/link'
import { rorFromUrl } from 'src/utils/helpers'

type Props = {
  people: Person[]
}

const PersonTable: React.FunctionComponent<Props> = ({ people }) => {
  // const [selectedOption, setSelectedOption] = React.useState('')

  // const name = person.familyName
  //   ? [person.givenName, person.familyName].join(' ')
  //   : person.name

  // if (person.id && person.id.startsWith('https://orcid.org/0'))
  //   return (
  //     <>
  //       <h4 className="work">
  //         <Link href={'/orcid.org' + orcidFromUrl(person.id)}>
  //           <a>{name}</a>
  //         </Link>
  //       </h4>
  //       {person.affiliation.length > 0 && (
  //         <>
  //           <div className="affiliation">
  //             {person.affiliation.map((item) =>
  //               item.id ? (
  //                 <Link key={item.id} href={'/ror.org' + rorFromUrl(item.id)}>
  //                   <a>{item.name}</a>
  //                 </Link>
  //               ) : (
  //                 <div key={item.name}>{item.name}</div>
  //               )
  //             )}
  //           </div>
  //         </>
  //       )}
  //       {person.contributorType && (
  //         <div className="contributor-type">
  //           {startCase(person.contributorType)}
  //         </div>
  //       )}
  //     </>
  //   )

  // if (person.id && person.id.startsWith('https://ror.org/0'))
  //   return (
  //     <>
  //       <h4 className="work">
  //         <Link href={'/ror.org' + rorFromUrl(person.id)}>
  //           <a>{name}</a>
  //         </Link>
  //       </h4>
  //       {person.affiliation.length > 0 && (
  //         <>
  //           <div className="affiliation">
  //             {person.affiliation.map((item) =>
  //               item.id ? (
  //                 <Link key={item.id} href={'/ror.org' + rorFromUrl(item.id)}>
  //                   <a>{item.name}</a>
  //                 </Link>
  //               ) : (
  //                 <div key={item.name}>{item.name}</div>
  //               )
  //             )}
  //           </div>
  //         </>
  //       )}
  //       {person.contributorType && (
  //         <div className="contributor-type">
  //           {startCase(person.contributorType)}
  //         </div>
  //       )}
  //     </>
  //   )

  return (
    <Table striped condensed>
      <tbody>
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
