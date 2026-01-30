export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image?: string
  link?: string
  github?: string
  featured: boolean
  hackathon?: {
    name: string
    placement: string
  }
}

export const projects: Project[] = [
  {
    id: 'scholarship-routing',
    title: 'Scholarship Routing',
    description: 'A comprehensive platform helping students overcome barriers of finding international scholarships. Features AI-powered chatbot consultant using Gemini + RAG, smart search engine, advanced filtering, and application tracking dashboard.',
    tags: ['AI/ML', 'Gemini', 'RAG', 'React', 'FastAPI', 'Full-Stack'],
    image: '/images/poster-SEEAPP-2025.jpg',
    link: 'https://scholarshipsrouting.netlify.app/',
    featured: true,
    hackathon: {
      name: 'AISC 2025 & SEEAPP 2025',
      placement: '🥇 Double Champion'
    }
  },
  {
    id: 'foxy-adventure',
    title: 'Foxy Adventure',
    description: 'An action platformer game where Foxy the fox hunts for treasure. Features unique crafting system with elemental combinations and counter mechanics - your power is determined by your own hands!',
    tags: ['Game Dev', 'Godot', 'GDScript', 'Platformer'],
    image: '/images/present_vng.jpg',
    link: 'https://doandev.itch.io/foxy-adventure',
    featured: true,
  },
  {
    id: 'ai-agent-platform',
    title: 'AI Agent Platform',
    description: 'Multi-agent orchestration platform with LangChain, featuring autonomous task decomposition and parallel agent execution.',
    tags: ['AI/ML', 'LangChain', 'Python', 'FastAPI'],
    featured: false,
  },
  {
    id: 'livekit-learning-room',
    title: 'Livekit Learning Room',
    description: 'Online interactive learning meeting room with teacher and student featuring polling, whiteboard, and attendance check.',
    tags: ['LiveKit', 'Angular', 'ASP.NET Core', 'Real-time'],
    featured: false,
  },
]

export const featuredProjects = projects.filter(p => p.featured)
export const hackathonProjects = projects.filter(p => p.hackathon)
