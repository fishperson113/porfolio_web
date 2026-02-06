'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import AnimatedText from '@/components/ui/animated-text'
import { achievements } from '@/data/achievements'

const typeColors: Record<string, string> = {
  hackathon: '#ADFF2F',
  award: '#F59E0B',
  certification: '#3B82F6',
  milestone: '#10B981',
  game: '#A855F7',
}

const typeIcons: Record<string, string> = {
  hackathon: '🏆',
  award: '🎖️',
  certification: '📜',
  milestone: '🚀',
  game: '🎮',
}

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <AnimatedText text="Achievement" className="text-[#FAFAFA]" />
            {' '}
            <AnimatedText text="Timeline" className="text-[#ADFF2F]" staggerDelay={0.08} />
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            A journey of building, winning, and continuous learning.
          </p>
        </motion.div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#ADFF2F] via-[rgba(173,255,47,0.3)] to-transparent" />
          
          {/* Timeline Items */}
          <div className="space-y-12">
            {achievements.map((achievement, idx) => {
              const isLeft = idx % 2 === 0
              const color = typeColors[achievement.type]
              const icon = typeIcons[achievement.type]
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`relative flex items-start gap-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                    <div 
                      className="w-4 h-4 rounded-full border-2"
                      style={{ 
                        borderColor: color,
                        backgroundColor: '#0A0A0F',
                        boxShadow: `0 0 10px ${color}40`
                      }}
                    />
                  </div>
                  
                  {/* Content Card */}
                  <div 
                    className={`
                      flex-1 ml-20 md:ml-0
                      ${isLeft ? 'md:mr-[calc(50%+2rem)]' : 'md:ml-[calc(50%+2rem)]'}
                    `}
                  >
                    <div className="p-6 rounded-2xl bg-[rgba(18,18,26,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.15)] transition-colors overflow-hidden">
                      {/* Image */}
                      {achievement.image && (
                        <div className="relative w-full h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                          <Image
                            src={achievement.image}
                            alt={achievement.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,18,26,0.9)] to-transparent" />
                        </div>
                      )}
                      
                      {/* Date & Type Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{icon}</span>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                          style={{ 
                            backgroundColor: `${color}20`,
                            color: color,
                            border: `1px solid ${color}40`
                          }}
                        >
                          {achievement.type}
                        </span>
                        <span className="text-sm text-[#71717A]">
                          {new Date(achievement.date).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">
                        {achievement.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-[#A1A1AA] leading-relaxed mb-4">
                        {achievement.description}
                      </p>
                      
                      {/* Link */}
                      {achievement.link && (
                        <a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-[#ADFF2F] hover:underline"
                        >
                          <span>Learn more</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
