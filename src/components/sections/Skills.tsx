'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import AnimatedText from '@/components/ui/animated-text'
import { skillCategories } from '@/data/skills'

// Dynamic import for 3D components (SSR disabled)
const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false })
const SkillOrbit = dynamic(() => import('@/components/3d/SkillOrbit'), { ssr: false })

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: 3D Skill Orbit */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] order-2 lg:order-1"
          >
            <Scene className="w-full h-full">
              <SkillOrbit autoRotate rotationSpeed={0.15} />
            </Scene>
            
            {/* Gradient fade */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0A0A0F_80%)]" />
          </motion.div>
          
          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <AnimatedText text="End-to-End" className="text-[#FAFAFA]" />
              {' '}
              <AnimatedText text="Expertise" className="text-[#ADFF2F]" staggerDelay={0.08} />
            </h2>
            
            <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
              From concept to deployment, I build across the entire stack. 
              AI at the core, with deep expertise spanning web, mobile, and game development.
            </p>
            
            {/* Skill Categories */}
            <div className="space-y-4">
              {skillCategories.map((category, idx) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-[rgba(18,18,26,0.5)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="text-lg font-semibold text-[#FAFAFA]">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[#71717A] mb-3">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2 py-1 text-xs rounded bg-[rgba(255,255,255,0.05)] text-[#A1A1AA]"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {category.skills.length > 4 && (
                      <span className="px-2 py-1 text-xs text-[#71717A]">
                        +{category.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
