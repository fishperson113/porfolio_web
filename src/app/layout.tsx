import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Elite Portfolio | AI Engineer & Full-Stack Generalist',
  description: 'High-performance portfolio showcasing end-to-end product development, AI engineering, and hackathon wins.',
  keywords: ['AI Engineer', 'Full-Stack Developer', 'Web Developer', 'App Developer', 'Game Developer', 'Hackathon Winner'],
  authors: [{ name: 'AI Engineer' }],
  openGraph: {
    title: 'Elite Portfolio | AI Engineer & Full-Stack Generalist',
    description: 'High-performance portfolio showcasing end-to-end product development.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
