import React from "react"
import Layout from '../components/Layout'
import Search from '../components/Search'

const IndexPage = () => {  
  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE || 'Home'}>
      <Search />
    </Layout>
  )
}

export default IndexPage
