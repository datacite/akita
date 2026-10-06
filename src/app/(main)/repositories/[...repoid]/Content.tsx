import React from 'react'

import { Repository as RepositoryType } from 'src/data/types'
import { fetchRepository, QueryVar } from 'src/data/queries/repositoryQuery'

import Error from 'src/components/Error/Error'
import Title from 'src/components/Title/Title'
import { RepositorySidebar } from 'src/components/RepositoryDetail/RepositorySidebar'
import { RepositoryDetail } from 'src/components/RepositoryDetail/RepositoryDetail'
import CommonsLayout from 'src/components/CommonsLayout/CommonsLayout'

interface Props {
  variables: QueryVar
  isBot?: boolean
}

export default async function Content(props: Props) {
  const { variables } = props

  const { data, error } = await fetchRepository(variables.id)

  if (error)
    return (
      <CommonsLayout>
        <Error title="An error occured." message={error.message} />
      </CommonsLayout>
    )

  const repository = data?.repository || ({} as RepositoryType)

  return (
    <>
      <CommonsLayout className="mb-4" />

      <CommonsLayout
        sidebarClassName=""
        sidebar={
          <>
            <h2 className="visually-hidden">Repository Sidebar</h2>
            <RepositorySidebar repo={repository} />
          </>
        }
      >
        <h2 className="visually-hidden">Repository Details</h2>
        <Title
          title={repository.name}
          titleLink={repository.url}
          offset={false}
        />
        <RepositoryDetail repo={repository} />
      </CommonsLayout>
    </>
  )
}
