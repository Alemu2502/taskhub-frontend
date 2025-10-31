import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskHub - Earn Money by Engaging with Content',
  description: 'Join TaskHub and turn your online engagement into earnings! Watch videos, follow social media accounts, and earn rewards.',
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
