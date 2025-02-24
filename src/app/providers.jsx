'use client'

import { SessionProvider } from 'next-auth/react'
import { ApplicationDataProvider } from '@/context/ApplicationDataContext'

export default function Providers ({ children }) {
  return (
    <SessionProvider>
      <ApplicationDataProvider>
      {children}
      </ApplicationDataProvider>
    </SessionProvider>
  )
}
