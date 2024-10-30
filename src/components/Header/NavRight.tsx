'use client'

import React from 'react';
import { session } from 'src/utils/session';

interface Props {
  signedInContent: React.ReactNode
  signedOutContent: React.ReactNode
}

export default function NavRight({ signedInContent, signedOutContent }: Props) {
  const user = session()

  if (!user) return signedOutContent
  return signedInContent
}
