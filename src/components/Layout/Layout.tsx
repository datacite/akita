import * as React from 'react'
import Head from 'next/head'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Consent from '../Consent/Consent'

type Props = {
  path: string
}

const Layout: React.FunctionComponent<Props> = ({ children, path }) => (
  <div>
    <Head>
      <title>DataCite Commons</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600"
        rel="stylesheet"
      />
      <link
        href="https://assets.datacite.org/stylesheets/doi.css?version=3.8.0"
        rel="stylesheet"
        type="text/css"
      />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Head>
    <Header path={path} />
    <div className="container-fluid">{children}</div>
    <Consent />
    <Footer />
  </div>
)

export default Layout
