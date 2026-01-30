export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'hackathon' | 'award' | 'certification' | 'milestone'
  icon?: string
  link?: string
}

export const achievements: Achievement[] = [
  {
    id: 'ai-builders-2024',
    title: 'AI Builders Hackathon - 1st Place',
    description: 'Won first place with an AI Agent Platform featuring multi-agent orchestration and autonomous task decomposition.',
    date: '2024-11',
    type: 'hackathon',
  },
  {
    id: 'devtools-2024',
    title: 'DevTools Summit - 2nd Place',
    description: 'Built a real-time collaborative editor with CRDT-based conflict resolution supporting 100+ concurrent users.',
    date: '2024-09',
    type: 'hackathon',
  },
  {
    id: 'ml-world-cup-2023',
    title: 'ML World Cup - Grand Prize',
    description: 'Created a mobile-optimized neural style transfer application running at 30fps on consumer devices.',
    date: '2023-12',
    type: 'hackathon',
  },
  {
    id: 'google-cloud-2023',
    title: 'Google Cloud Certified - Professional',
    description: 'Achieved Google Cloud Professional Cloud Architect certification.',
    date: '2023-08',
    type: 'certification',
  },
  {
    id: 'startup-launch-2023',
    title: 'Startup Launch',
    description: 'Co-founded and launched an AI-powered developer tools startup, reaching 10K+ users in the first month.',
    date: '2023-06',
    type: 'milestone',
  },
  {
    id: 'open-source-2022',
    title: 'Open Source Contributor Award',
    description: 'Recognized as a top contributor to major open-source projects in the AI/ML ecosystem.',
    date: '2022-12',
    type: 'award',
  },
]

export const getAchievementsByYear = () => {
  const grouped: Record<string, Achievement[]> = {}
  achievements.forEach(achievement => {
    const year = achievement.date.split('-')[0]
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(achievement)
  })
  return grouped
}
