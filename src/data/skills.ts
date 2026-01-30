export interface Skill {
  id: string
  name: string
  category: 'ai' | 'web' | 'app' | 'game' | 'backend' | 'languages' | 'tools'
  level: number
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
    id: 'languages',
    name: 'Programming Languages',
    description: 'Core languages for software development',
    color: '#ADFF2F',
    skills: [
      { id: 'typescript', name: 'TypeScript', category: 'languages', level: 95 },
      { id: 'python', name: 'Python', category: 'languages', level: 95 },
      { id: 'javascript', name: 'JavaScript', category: 'languages', level: 95 },
      { id: 'go', name: 'Go', category: 'languages', level: 80 },
      { id: 'cpp', name: 'C++', category: 'languages', level: 85 },
      { id: 'csharp', name: 'C#', category: 'languages', level: 80 },
      { id: 'kotlin', name: 'Kotlin', category: 'languages', level: 75 },
    ]
  },
  {
    id: 'ai',
    name: 'AI & ML Engineering',
    description: 'Machine Learning, LLMs, Data Science',
    color: '#FF6F00',
    skills: [
      { id: 'tensorflow', name: 'TensorFlow', category: 'ai', level: 85 },
      { id: 'keras', name: 'Keras', category: 'ai', level: 85 },
      { id: 'sklearn', name: 'scikit-learn', category: 'ai', level: 90 },
      { id: 'pandas', name: 'Pandas', category: 'ai', level: 90 },
      { id: 'numpy', name: 'NumPy', category: 'ai', level: 90 },
      { id: 'mlflow', name: 'MLflow', category: 'ai', level: 75 },
    ]
  },
  {
    id: 'web',
    name: 'Web Development',
    description: 'Frontend & Full-Stack Web Apps',
    color: '#3B82F6',
    skills: [
      { id: 'react', name: 'React', category: 'web', level: 95 },
      { id: 'vue', name: 'Vue.js', category: 'web', level: 85 },
      { id: 'angular', name: 'Angular', category: 'web', level: 80 },
      { id: 'tailwind', name: 'TailwindCSS', category: 'web', level: 95 },
      { id: 'vite', name: 'Vite', category: 'web', level: 90 },
      { id: 'nodejs', name: 'Node.js', category: 'web', level: 95 },
      { id: 'fastapi', name: 'FastAPI', category: 'web', level: 90 },
    ]
  },
  {
    id: 'app',
    name: 'App Development',
    description: 'Mobile & Cross-Platform Apps',
    color: '#10B981',
    skills: [
      { id: 'react-native', name: 'React Native', category: 'app', level: 90 },
      { id: 'flutter', name: 'Flutter', category: 'app', level: 85 },
    ]
  },
  {
    id: 'game',
    name: 'Game Development',
    description: 'Game Engines & Interactive Media',
    color: '#F59E0B',
    skills: [
      { id: 'unity', name: 'Unity', category: 'game', level: 80 },
      { id: 'godot', name: 'Godot', category: 'game', level: 75 },
    ]
  },
  {
    id: 'backend',
    name: 'Backend & DevOps',
    description: 'Databases, Cloud, CI/CD',
    color: '#EC4899',
    skills: [
      { id: 'mysql', name: 'MySQL', category: 'backend', level: 90 },
      { id: 'mongodb', name: 'MongoDB', category: 'backend', level: 85 },
      { id: 'redis', name: 'Redis', category: 'backend', level: 85 },
      { id: 'elasticsearch', name: 'Elasticsearch', category: 'backend', level: 80 },
      { id: 'nginx', name: 'Nginx', category: 'backend', level: 80 },
      { id: 'prometheus', name: 'Prometheus', category: 'backend', level: 75 },
      { id: 'grafana', name: 'Grafana', category: 'backend', level: 75 },
    ]
  },
  {
    id: 'tools',
    name: 'Tools & Testing',
    description: 'Version Control, Testing, Design',
    color: '#8B5CF6',
    skills: [
      { id: 'git', name: 'Git', category: 'tools', level: 95 },
      { id: 'github', name: 'GitHub', category: 'tools', level: 95 },
      { id: 'selenium', name: 'Selenium', category: 'tools', level: 85 },
      { id: 'postman', name: 'Postman', category: 'tools', level: 90 },
      { id: 'figma', name: 'Figma', category: 'tools', level: 80 },
    ]
  }
]

export const allSkills = skillCategories.flatMap(cat => cat.skills)
