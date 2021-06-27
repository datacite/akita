import React from 'react'
import { usePlausible } from 'next-plausible'
import Header from '../components/Header/Header.tsx'
import Footer from '../components/Footer/Footer.tsx'

const ErrorPage = () => {
  const plausible = usePlausible()
  if (process.browser) {
    plausible('404')
  }

  return (
    <>
      <Header />
      <div className="container px-4 pt-16 flex flex-wrap mx-auto h-screen">
        <h1 className="text-red-500">404 Page Not Found</h1>
      </div>
      <Footer />
    </>
  )
}

export default ErrorPage
