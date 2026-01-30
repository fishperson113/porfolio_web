'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import BentoCard from '@/components/ui/BentoCard'
import { projects } from '@/data/projects'

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#FAFAFA]">Featured </span>
            <span className="text-[#ADFF2F]">Projects</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            A curated showcase of hackathon wins, side projects, and experiments in AI, web, and beyond.
          </p>
        </motion.div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`
                ${project.featured && idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                ${project.featured && idx === 1 ? 'lg:row-span-2' : ''}
              `}
            >
              <BentoCard 
                spotlight 
                featured={project.featured}
                className="h-full"
              >
                {/* Project Image */}
                {project.image && (
                  <div className="relative w-full h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,18,26,0.95)] via-[rgba(18,18,26,0.5)] to-transparent" />
                    
                    {/* Hackathon Badge Overlay */}
                    {project.hackathon && (
                      <div className="absolute bottom-4 left-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-sm border border-[rgba(173,255,47,0.4)] text-sm font-semibold text-[#ADFF2F]">
                          {project.hackathon.placement}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Hackathon Badge (if no image) */}
                {project.hackathon && !project.image && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(173,255,47,0.1)] border border-[rgba(173,255,47,0.3)] text-sm text-[#ADFF2F] mb-4">
                    {project.hackathon.placement}
                  </div>
                )}
                
                {/* Title */}
                <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">
                  {project.title}
                </h3>
                
                {/* Hackathon Name */}
                {project.hackathon && (
                  <p className="text-sm text-[#71717A] mb-3">
                    {project.hackathon.name}
                  </p>
                )}
                
                {/* Description */}
                <p className="text-[#A1A1AA] mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-[rgba(255,255,255,0.05)] text-[#A1A1AA] border border-[rgba(255,255,255,0.1)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Links */}
                {(project.link || project.github) && (
                  <div className="flex gap-4 mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ADFF2F] text-[#0A0A0F] font-semibold text-sm hover:bg-[#8BCC26] transition-colors"
                      >
                        <span>Visit Website</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#A1A1AA] hover:text-[#FAFAFA]"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </BentoCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
