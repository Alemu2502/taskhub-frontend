import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskHubOnline – Earn Real Rewards for Everyday Online Tasks',
  description: 'Join TaskHubOnline and get rewarded for completing simple, real online activities like watching videos, following social pages, and more. No investment required – just sign up and start earning genuine rewards for your time and effort.',
  icons: {
    icon: '/favicon.ico',
  },
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
