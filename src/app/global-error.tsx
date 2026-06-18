'use client'

import * as Sentry from '@sentry/nextjs'
import React, { useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main className="container-fluid py-5">
          <Alert variant="danger">
            <h4>Something went wrong</h4>
            <p>An unexpected error occurred. Please try again.</p>
            <button type="button" className="btn btn-primary" onClick={() => reset()}>
              Try again
            </button>
          </Alert>
        </main>
      </body>
    </html>
  )
}
