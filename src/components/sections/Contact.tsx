'use client'

import { motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import GlowButton from '@/components/ui/GlowButton'

const socialLinks = [
  { name: 'GitHub', url: '#', icon: '🔗' },
  { name: 'LinkedIn', url: '#', icon: '💼' },
  { name: 'Twitter', url: '#', icon: '🐦' },
  { name: 'Email', url: 'mailto:hello@example.com', icon: '✉️' },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#FAFAFA]">Let&apos;s </span>
              <span className="text-[#ADFF2F]">Connect</span>
            </h2>
            
            <p className="text-[#A1A1AA] text-lg mb-8 max-w-xl mx-auto">
              Got a project in mind? Let&apos;s build something amazing together. 
              Reach out and let&apos;s discuss how we can collaborate.
            </p>
            
            {/* Email CTA */}
            <GlowButton 
              variant="primary" 
              size="lg"
              href="mailto:hello@example.com"
            >
              Say Hello 👋
            </GlowButton>
            
            {/* Social Links */}
            <div className="flex justify-center gap-6 mt-8">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#ADFF2F] transition-colors"
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-sm">{link.name}</span>
                </a>
              ))}
            </div>
          </GlassCard>
          
          {/* Footer */}
          <p className="text-[#71717A] text-sm mt-12">
            © {new Date().getFullYear()} Elite Portfolio. Built with Next.js, Three.js, and ☕
          </p>
        </motion.div>
      </div>
    </section>
  )
}
