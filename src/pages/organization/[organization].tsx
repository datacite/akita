import React from "react"
import Layout from '../../components/Layout/Layout'
import OrganizationContainer from '../../components/OrganizationContainer/OrganizationContainer'
import { GetServerSideProps } from 'next'

const OrganizationPage = ({ organizationPath }) => {
    return (
        <Layout title={process.env.NEXT_PUBLIC_TITLE}>
            <OrganizationContainer rorId={organizationPath} />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const organizationPath = context.params.organization

    return {
        props: { organizationPath },
    }
}

export default OrganizationPage
