import React from "react"
import Layout from '../components/Layout/Layout'
import Search from '../components/Search/Search'

const IndexPage = () => {  
  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <Search />
    </Layout>
  )
}

export default IndexPage
