import React, { PropsWithChildren } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import InfoPanel from '../InfoPanel/InfoPanel'


export function WorksExampleText() {
  const href1 = "/doi.org?query=climate+change"
  const href2 = "/doi.org?query=10.14454%2F3w3z-sa82"

  return <ExampleText heading='Search works by keyword or DOI'>
    Try <Search href={href1}>climate change</Search> or <Search href={href2}>10.14454/3w3z-sa82</Search>
  </ExampleText>
}


export function OrganizationsExampleText() {
  const href1 = "/ror.org?query=British+Library"
  const href2 = "/ror.org?query=https%3A%2F%2Fror.org%2F05dhe8b71"

  return <ExampleText heading="Search organizations by organization name, keyword, or ROR ID">
    Try <Search href={href1}>British Library</Search> or <Search href={href2}>https://ror.org/05dhe8b71</Search>
  </ExampleText>
}


export function PeopleExampleText() {
  const href1 = "/orcid.org?query=Sofia+Maria+Hernandez+Garcia"
  const href2 = "/orcid.org?query=0000-0001-5727-2427"

  return <ExampleText heading="Search people by name, keyword, or ORCID iD">
    Try <Search href={href1}>Sofia Maria Hernandez Garcia</Search> or <Search href={href2}>0000-0001-5727-2427</Search>
  </ExampleText>
}


export function RepositoriesExampleText() {
  const href1 = "/repositories?query=Dryad"
  const href2 = "/repositories?query=biology"

  return <ExampleText heading="Search repositories by repository name or keyword">
    Try <Search href={href1}>Dryad</Search> or <Search href={href2}>biology</Search>
  </ExampleText>
}



function ExampleText(props: { heading: string } & PropsWithChildren) {
  return (
    <>
      <Row className="justify-content-center">
        <Col xs={11}>
          <div>
            <h1 className="mt-5 text-center">{props.heading}</h1>
            <p className="text-center">
              {props.children}
            </p>
          </div>
        </Col>
      </Row>
      <InfoPanel />
    </>
  )
}


function Search(props: { href: string } & PropsWithChildren) {
  return <Link href={props.href} className="mx-2">
    <FontAwesomeIcon icon={faSearch} className="me-1" />{props.children}
  </Link>
}
