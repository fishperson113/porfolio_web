'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks'

interface AnimatedTextProps {
  text: string
  className?: string
  staggerDelay?: number
}

export default function AnimatedText({
  text,
  className,
  staggerDelay = 0.05,
}: AnimatedTextProps) {
  const prefersReduced = useReducedMotion()
  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : staggerDelay,
        delayChildren: prefersReduced ? 0 : 0.1,
      },
    },
  }

  const child = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.5 },
    },
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={child} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
