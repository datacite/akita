import React from 'react'

import SearchWork from 'src/components/SearchWork/SearchWork'
import { QueryVar } from 'src/data/queries/searchDoiQuery'
import { WorksExampleText } from 'src/components/ExampleText/ExampleText'

interface Props {
  searchParams: Promise<SearchParams>
}

interface SearchParams extends Partial<QueryVar> {
  filterQuery?: string
}

export default async function SearchDoiPage(props: Props) {
  const searchParams = await props.searchParams;
  const { query, filterQuery, ...vars } = searchParams

  const variables = {
    ...vars,
    resourceTypeId: vars['resource-type'],
    fieldOfScience: vars['field-of-science'],
    registrationAgency: vars['registration-agency'],
    clientType: vars['repository-type'],
    clientId: vars['client-id'],
  }

  // Show example text if there is no query
  if (!query || query === '')
    return <WorksExampleText />


  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  return <SearchWork variables={{ query: queryStatement, ...variables }} />
}
