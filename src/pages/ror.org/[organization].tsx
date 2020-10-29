import React from 'react'
import Layout from '../../components/Layout/Layout'
import OrganizationContainer from '../../components/OrganizationContainer/OrganizationContainer'
import { useRouter } from 'next/router'

const OrganizationPage = () => {
  const router = useRouter()
  const rorId = router.asPath.substring(9)
  const query = router.query.query as string

  return (
    <Layout path={'/ror.org/' + rorId} >
      <OrganizationContainer rorId={rorId} searchQuery={query} />
    </Layout>
  )
}

export default OrganizationPage
