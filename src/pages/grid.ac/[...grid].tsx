import React from 'react'
import Layout from '../../components/Layout/Layout'
import OrganizationContainer from '../../components/OrganizationContainer/OrganizationContainer'
import { useRouter } from 'next/router'

const GridPage = ({ gridPath }) => {
  const router = useRouter()
  const gridId = router.asPath.substring(10)
  const query = router.query.query as string

  return (
    <Layout path={gridPath} >
      <OrganizationContainer gridId={gridId} searchQuery={query} />
    </Layout>
  )
}

export default GridPage
