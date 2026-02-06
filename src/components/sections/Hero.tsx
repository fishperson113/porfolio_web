'use client'

import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import GlowButton from '@/components/ui/GlowButton'

// Dynamic import for 3D components (SSR disabled)
const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false })
const NeuralNetwork = dynamic(() => import('@/components/3d/NeuralNetwork'), { ssr: false })
const FloatingParticles = dynamic(() => import('@/components/3d/floating-particles'), { ssr: false })

export default function Hero() {
  // Scroll-based animation for exit effect
  const { scrollY } = useScroll()
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 150], [1, 0])
  const scrollIndicatorY = useTransform(scrollY, [0, 150], [0, 30])
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene className="w-full h-full">
          <NeuralNetwork nodeCount={400} connectionCount={600} />
          <FloatingParticles />
        </Scene>
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0F] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0A0A0F_70%)] z-10" />
      
      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(173,255,47,0.1)] border border-[rgba(173,255,47,0.3)] mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#ADFF2F] animate-pulse" />
            <span className="text-sm text-[#ADFF2F] font-medium">Available for Projects</span>
          </motion.div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-[#FAFAFA]">AI Engineer &</span>
            <br />
            <span className="bg-gradient-to-r from-[#FAFAFA] to-[#ADFF2F] bg-clip-text text-transparent">
              Full-Stack Generalist
            </span>
          </h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-[#A1A1AA] mb-8 max-w-2xl mx-auto"
          >
            End-to-end product builder. Serial hackathon winner.
            <br />
            Crafting <span className="text-[#ADFF2F]">Web</span>, <span className="text-[#ADFF2F]">App</span>, and <span className="text-[#ADFF2F]">Game</span> experiences.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <GlowButton variant="primary" size="lg" href="#projects">
              View Projects
            </GlowButton>
            <GlowButton variant="secondary" size="lg" href="#contact">
              Get in Touch
            </GlowButton>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator with exit effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{ 
            opacity: scrollIndicatorOpacity,
            y: scrollIndicatorY
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-[#71717A]">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-8 rounded-full border-2 border-[#71717A] flex items-start justify-center p-1"
            >
              <div className="w-1 h-2 rounded-full bg-[#ADFF2F]" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
