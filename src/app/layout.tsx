import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { MotionProvider } from '@/contexts/motion-context'
import { CursorProvider } from '@/hooks/use-cursor-state'
import CustomCursor from '@/components/ui/custom-cursor'
import Preloader from '@/components/ui/preloader'
import EasterEgg from '@/components/effects/easter-egg'
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
  title: 'Duong Pham | AI Engineer & Full-Stack Generalist',
  description: 'High-performance portfolio showcasing end-to-end product development, AI engineering, and hackathon wins.',
  keywords: ['AI Engineer', 'Full-Stack Developer', 'Web Developer', 'App Developer', 'Game Developer', 'Hackathon Winner'],
  authors: [{ name: 'Duong Pham' }],
  openGraph: {
    title: 'Duong Pham | AI Engineer & Full-Stack Generalist',
    description: 'High-performance portfolio showcasing end-to-end product development.',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
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
        <MotionProvider>
          <CursorProvider>
            <Preloader />
            <CustomCursor />
            <EasterEgg />
            {children}
          </CursorProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
