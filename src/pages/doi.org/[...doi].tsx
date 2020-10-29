import React from 'react'
import Layout from '../../components/Layout/Layout'
import WorkContainer from '../../components/WorkContainer/WorkContainer'
import OrganizationContainer from '../../components/OrganizationContainer/OrganizationContainer'
import { useRouter } from 'next/router'

const DoisPage = () => {
  const router = useRouter()
  // workaround as doi may contain slashes
  const doi = router.asPath.substring(9)
  const query = router.query.query as string

  // if DOI is a Crossref Funder ID
  if (doi.startsWith('10.13039'))
    return (
      <Layout path={doi} >
        <OrganizationContainer crossrefFunderId={doi} searchQuery={query} />
      </Layout>
    )

  return (
    <Layout path={'/doi.org/' + doi } >
      <WorkContainer item={doi} searchQuery={query} />
    </Layout>
  )
}

export default DoisPage
