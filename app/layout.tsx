import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kind Frame',
  description: 'Created by Theekshana Harischandra',
  generator: 'Theekshana Harischandra',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
