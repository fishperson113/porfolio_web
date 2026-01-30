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
    id: 'ai-agent-platform',
    title: 'AI Agent Platform',
    description: 'Multi-agent orchestration platform with LangChain, featuring autonomous task decomposition and parallel agent execution.',
    tags: ['AI/ML', 'LangChain', 'Python', 'FastAPI'],
    featured: true,
    hackathon: {
      name: 'AI Builders Hackathon 2024',
      placement: '🥇 1st Place'
    }
  },
  {
    id: 'realtime-collab-editor',
    title: 'Real-time Collaborative Editor',
    description: 'Google Docs-like editor with CRDT-based conflict resolution, supporting 100+ concurrent users with sub-50ms latency.',
    tags: ['WebSocket', 'CRDT', 'React', 'Node.js'],
    featured: true,
    hackathon: {
      name: 'DevTools Summit 2024',
      placement: '🥈 2nd Place'
    }
  },
  {
    id: 'mobile-game-engine',
    title: 'Cross-Platform Game Engine',
    description: 'Lightweight game engine for mobile, featuring ECS architecture, physics simulation, and hot-reload development.',
    tags: ['Game Dev', 'TypeScript', 'WebGL', 'React Native'],
    featured: true,
  },
  {
    id: 'neural-style-transfer',
    title: 'Neural Style Transfer App',
    description: 'Real-time artistic style transfer using optimized neural networks. Runs at 30fps on mobile devices.',
    tags: ['ML', 'TensorFlow', 'Python', 'Flutter'],
    featured: false,
    hackathon: {
      name: 'ML World Cup 2023',
      placement: '🏆 Grand Prize'
    }
  },
  {
    id: 'smart-home-hub',
    title: 'Smart Home Hub',
    description: 'IoT orchestration platform with voice control, automation rules, and energy optimization using predictive ML.',
    tags: ['IoT', 'Raspberry Pi', 'Python', 'React'],
    featured: false,
  },
  {
    id: 'blockchain-identity',
    title: 'Decentralized Identity',
    description: 'Self-sovereign identity solution with zero-knowledge proofs for privacy-preserving credential verification.',
    tags: ['Web3', 'Solidity', 'ZK-Proofs', 'Next.js'],
    featured: false,
  }
]

export const featuredProjects = projects.filter(p => p.featured)
export const hackathonProjects = projects.filter(p => p.hackathon)
