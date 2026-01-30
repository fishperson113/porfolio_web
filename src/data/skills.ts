export interface Skill {
  id: string
  name: string
  category: 'ai' | 'web' | 'app' | 'game' | 'backend'
  level: number // 1-100
  icon?: string
}

export interface SkillCategory {
  id: string
  name: string
  description: string
  color: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'ai',
    name: 'AI Engineering',
    description: 'Machine Learning, LLMs, Agent Systems',
    color: '#ADFF2F', // Cyber Lime - center focus
    skills: [
      { id: 'langchain', name: 'LangChain', category: 'ai', level: 95 },
      { id: 'pytorch', name: 'PyTorch', category: 'ai', level: 85 },
      { id: 'tensorflow', name: 'TensorFlow', category: 'ai', level: 80 },
      { id: 'openai', name: 'OpenAI API', category: 'ai', level: 95 },
      { id: 'huggingface', name: 'Hugging Face', category: 'ai', level: 85 },
      { id: 'rag', name: 'RAG Systems', category: 'ai', level: 90 },
    ]
  },
  {
    id: 'web',
    name: 'Web Development',
    description: 'Frontend & Full-Stack Web Apps',
    color: '#3B82F6', // Blue
    skills: [
      { id: 'react', name: 'React', category: 'web', level: 95 },
      { id: 'nextjs', name: 'Next.js', category: 'web', level: 95 },
      { id: 'typescript', name: 'TypeScript', category: 'web', level: 90 },
      { id: 'tailwind', name: 'Tailwind CSS', category: 'web', level: 95 },
      { id: 'threejs', name: 'Three.js', category: 'web', level: 85 },
      { id: 'framer', name: 'Framer Motion', category: 'web', level: 90 },
    ]
  },
  {
    id: 'app',
    name: 'App Development',
    description: 'Mobile & Cross-Platform Apps',
    color: '#10B981', // Green
    skills: [
      { id: 'react-native', name: 'React Native', category: 'app', level: 90 },
      { id: 'flutter', name: 'Flutter', category: 'app', level: 85 },
      { id: 'expo', name: 'Expo', category: 'app', level: 90 },
      { id: 'swift', name: 'Swift', category: 'app', level: 70 },
      { id: 'kotlin', name: 'Kotlin', category: 'app', level: 70 },
    ]
  },
  {
    id: 'game',
    name: 'Game Development',
    description: 'Game Engines & Interactive Media',
    color: '#F59E0B', // Amber
    skills: [
      { id: 'unity', name: 'Unity', category: 'game', level: 80 },
      { id: 'godot', name: 'Godot', category: 'game', level: 75 },
      { id: 'webgl', name: 'WebGL', category: 'game', level: 85 },
      { id: 'phaser', name: 'Phaser', category: 'game', level: 80 },
    ]
  },
  {
    id: 'backend',
    name: 'Backend & DevOps',
    description: 'APIs, Databases, Cloud Infrastructure',
    color: '#EC4899', // Pink
    skills: [
      { id: 'nodejs', name: 'Node.js', category: 'backend', level: 95 },
      { id: 'python', name: 'Python', category: 'backend', level: 95 },
      { id: 'fastapi', name: 'FastAPI', category: 'backend', level: 90 },
      { id: 'postgresql', name: 'PostgreSQL', category: 'backend', level: 85 },
      { id: 'docker', name: 'Docker', category: 'backend', level: 85 },
      { id: 'aws', name: 'AWS', category: 'backend', level: 80 },
    ]
  }
]

export const allSkills = skillCategories.flatMap(cat => cat.skills)
