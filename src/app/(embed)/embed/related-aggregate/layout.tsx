import React, { PropsWithChildren, Suspense } from "react";
import { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import { Source_Sans_3 } from 'next/font/google';

import 'src/styles.css'

export const metadata: Metadata = {
  title: 'DataCite Commons',
}

const sourceSans3 = Source_Sans_3({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceSans3.className}>
      <head>
        <Suspense>
          <PlausibleProvider domain="commons.datacite.org" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css"
          />
        </Suspense>
      </head>
      <body className={sourceSans3.className}>
        {children}
      </body>
    </html>
  )
}
