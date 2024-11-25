import ToastProvider from '@components/providers/ToastProvider'
import { Nunito } from 'next/font/google'
import './globals.css'

import clsx from 'clsx'
import type { Metadata, Viewport } from 'next'

const nunito = Nunito({ subsets: ['latin'], weight: '400' })

const APP_NAME = 'DayStream'
const APP_DEFAULT_TITLE = 'DayStream - Track your day!'
const APP_TITLE_TEMPLATE = '%s - DayStream'
const APP_DESCRIPTION = 'Write about your experiences, and track your day!'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: '#111315',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="manifest" href="manifest.json" />
      <body
        className={clsx(nunito.className, 'bg-primary-dark')}
        suppressHydrationWarning
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
