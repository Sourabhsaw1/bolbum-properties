import type { Metadata } from 'next'
import '@/styles/globals.css'
import Animations from '@/components/ui/Animations'

export const metadata: Metadata = {
  title: { default: 'Bol Bum Property', template: '%s | Bol Bum Property' },
  description: 'Premium real estate platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Animations />
        {children}
      </body>
    </html>
  )
}
