/* eslint-disable no-unused-vars*/
import React from "react"
import Layout from '../../components/Layout'
import DoiContainer from '../../components/DoiContainer'
import { GetServerSideProps } from 'next'



const DoisPage = ({doiPath}) => {  

  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE || 'Home'}>
      <DoiContainer item={doiPath}/>
    </Layout>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const doiPath = context.params.doi;

  return {
    props: {doiPath}, // will be passed to the page component as props
  }
}

export default DoisPage
