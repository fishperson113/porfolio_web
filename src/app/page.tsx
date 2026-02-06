'use client'

import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Achievements from '@/components/sections/Achievements'
import Contact from '@/components/sections/Contact'

const StickyNavigation = dynamic(
  () => import('@/components/navigation/sticky-navigation')
)

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <StickyNavigation />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Achievements />
      <Contact />
    </main>
  )
}
