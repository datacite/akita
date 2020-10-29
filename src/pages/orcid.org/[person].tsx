import React from 'react'
import Layout from '../../components/Layout/Layout'
import PersonContainer from '../../components/PersonContainer/PersonContainer'
import { useRouter } from 'next/router'

const PersonPage = () => {
  const router = useRouter()
  const orcid = router.asPath.substring(11)
  const query = router.query.query as string

  return (
    <Layout path={'/orcid.org/' + orcid} >
      <PersonContainer orcid={orcid} searchQuery={query} />
    </Layout>
  )
}

export default PersonPage
