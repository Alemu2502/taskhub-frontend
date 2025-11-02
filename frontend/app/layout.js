import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskHubOnline – Make Money Online Instantly (No Investment Needed!)',
  description: 'Turn your online activity into real cash with TaskHubOnline! Watch videos, follow social pages, complete simple tasks, and get paid—100% free, no investment required.',
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
