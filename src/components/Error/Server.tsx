import React from 'react'
import { Alert } from 'src/components/Layout'

type Props = {
  title: string
  message: string
}

const Error: React.FunctionComponent<Props> = ({ title, message }) => {
  return (
    <Alert bsStyle="danger">
      <h4>{title}</h4>
      <p>{message}</p>
    </Alert>
  )
}

export default Error
