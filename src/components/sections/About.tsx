'use client'

import { motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'

export default function About() {
  const highlights = [
    {
      icon: '🧠',
      title: 'AI Engineering',
      description: 'Building autonomous agent frameworks & LLM orchestration.'
    },
    {
      icon: '⚡',
      title: 'Full-Stack',
      description: 'End-to-end capabilities in Web, Mobile, Game, and Backend.'
    },
    {
      icon: '🏆',
      title: 'Hackathons',
      description: 'Turning creative ideas into reality under high pressure.'
    }
  ]

  return (
    <section id="about" className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-[#FAFAFA]">About </span>
              <span className="text-[#ADFF2F]">Me</span>
            </h2>
            
            <GlassCard className="p-8 mb-8 bg-[rgba(18,18,26,0.4)]">
              <p className="text-[#A1A1AA] text-lg leading-relaxed mb-6">
                I am an <span className="text-[#ADFF2F]">AI Engineer & Full-Stack Generalist</span> passionate about building innovative, high-performance products from 0 to 1. 
              </p>
              <p className="text-[#A1A1AA] text-lg leading-relaxed">
                My focus encompasses cutting-edge <span className="text-[#FAFAFA]">AI Agent frameworks</span>, scalable infrastructure, and deep tech. I thrive in high-pressure environments like Hackathons, where I turn abstract creative ideas into tangible, winning solutions.
              </p>
            </GlassCard>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: '📍', text: 'Based in Vietnam' },
                { icon: '🚀', text: 'Open to Collaboration' },
                { icon: '�', text: 'Always Learning' },
                { icon: '🧩', text: 'Seeking Innovative Ideas' }
              ].map((tag) => (
                <span 
                  key={tag.text} 
                  className="px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#A1A1AA] text-sm flex items-center gap-2 hover:border-[#ADFF2F] hover:text-[#FAFAFA] transition-colors cursor-default"
                >
                  <span>{tag.icon}</span>
                  <span>{tag.text}</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-4"
          >
            {highlights.map((item, idx) => (
              <GlassCard 
                key={item.title}
                className="p-6 flex items-start gap-4 hover:border-[#ADFF2F] transition-colors group"
              >
                <div className="text-4xl bg-[rgba(173,255,47,0.1)] w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-1 group-hover:text-[#ADFF2F] transition-colors">{item.title}</h3>
                  <p className="text-[#A1A1AA]">{item.description}</p>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
