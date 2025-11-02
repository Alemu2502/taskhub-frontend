import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'usetaskhub – Earn Rewards by Engaging with Content',
  description: 'Join usetaskhub and get rewarded for your online engagement. Watch videos, follow social media accounts, and earn real rewards. Transparent, secure, $1 minimum payout, no investment required.',
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
