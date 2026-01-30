export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'hackathon' | 'award' | 'certification' | 'milestone' | 'game'
  image?: string
  link?: string
}

export const achievements: Achievement[] = [
  {
    id: 'scholarship-routing-launch',
    title: '🚀 Launched Scholarship Routing',
    description: 'Successfully launched Scholarship Routing platform - a comprehensive AI-powered solution helping students find international scholarships with smart search, advanced filtering, and AI chatbot consultant.',
    date: '2025-12',
    type: 'milestone',
    image: '/images/poster-SEEAPP-2025.jpg',
    link: 'https://scholarshipsrouting.netlify.app/',
  },
  {
    id: 'seeapp-2025',
    title: '🏆 Champion - SEEAPP 2025',
    description: 'Won Champion at the SE Mobile App Development Competition (SEEAPP) 2025 with Scholarship Routing mobile app featuring AI chatbot consultant using Gemini + RAG technology.',
    date: '2025-12',
    type: 'hackathon',
    image: '/images/1st-SEEAPP-2025.jpg',
    link: 'https://se.uit.edu.vn/vi/tin-t%E1%BB%A9c/12-su-kien-noi-bat/2166-l%E1%BB%85-trao-gi%E1%BA%A3i-seapp-2025.html?highlight=WyJzZWFwcCJd',
  },
  {
    id: 'aisc-2025',
    title: '🥇 1st Prize - AISC 2025',
    description: 'Won 1st Prize at the Advanced Information Systems Contest (AISC) 2025 organized by UIT with Scholarship Routing - helping students overcome barriers of finding international scholarships.',
    date: '2025-11',
    type: 'hackathon',
    image: '/images/AISC-CDH-4.jpg',
    link: 'https://httt.uit.edu.vn/aisc/',
  },
  {
    id: 'foxy-adventure',
    title: '🦊 Foxy Adventure Game Released',
    description: 'Released Foxy Adventure - an action platformer featuring unique crafting system with elemental combinations and counter mechanics. Players create their own playstyle through powerful weapon crafting.',
    date: '2025-12',
    type: 'game',
    image: '/images/present_vng.jpg',
    link: 'https://doandev.itch.io/foxy-adventure',
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
