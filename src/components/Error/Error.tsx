import React from 'react'
import { Alert } from 'src/components/Layout-4'

type Props = {
  title: string
  message: string
}

const Error: React.FunctionComponent<Props> = ({ title, message }) => {
  return (
    <Alert variant="danger">
      <h4>{title}</h4>
      <p>{message}</p>
    </Alert>
  )
}

export default Error
