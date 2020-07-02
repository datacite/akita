import React from "react"
import Layout from '../../components/Layout/Layout'
import PersonContainer from '../../components/PersonContainer/PersonContainer'
/* eslint-disable no-unused-vars*/
import { GetServerSideProps } from 'next'
/* eslint-ensable no-unused-vars*/

const PersonPage = ({personPath}) => {  
  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <PersonContainer item={personPath}/>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("context")
  console.log(context)

  const personPath = context.params.person

  return {
    props: {personPath}, // will be passed to the page component as props
  }
}

export default PersonPage
