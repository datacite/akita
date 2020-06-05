import * as React from 'react'
import Head from 'next/head'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

type Props = {
  title: string
}

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = process.env.NEXT_PUBLIC_TITLE
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600" rel="stylesheet" />
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" rel="stylesheet" type='text/css' />
      <link href="https://assets.datacite.org/stylesheets/doi.css?version=3.8.0" rel='stylesheet' type='text/css' />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Head>
    <Header title={title} />
    <div className="container-fluid">
      {children}
    </div>
    <Footer />
  </div>
)

export default Layout
