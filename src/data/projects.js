// `video` accepts a YouTube link/ID (https://youtu.be/ID, watch?v=ID, /shorts/ID, or the bare ID)
// or a self-hosted file served from /public (e.g. '/videos/survey-builder.mp4').
// `image` doubles as the poster frame when a video is set. Leave `video: null` for the icon card.
export const projects = [
  {
    id: 1,
    title: 'Interactive Survey Builder',
    description: 'A dynamic, drag-and-drop survey builder with conditional logic, GIS mapping integration via Leaflet.js, and AI-driven automation for predictive analysis and smart data validation.',
    tags: ['Laravel', 'Vue 3', 'Inertia.js', 'Tailwind CSS', 'Leaflet.js', 'OpenAI'],
    image: null,
    video: null,
    link: '#',
  },
  {
    id: 2,
    title: 'AI-Powered Chatbot Platform',
    description: 'Intelligent chatbot system integrated with OpenAI LLMs for automated customer support, dynamic content generation, and real-time data analysis within enterprise web applications.',
    tags: ['Laravel', 'OpenAI', 'Vue 3', 'Inertia.js', 'Laravel Prism'],
    image: null,
    video: null,
    link: '#',
  },
  {
    id: 3,
    title: 'GIS Mapping & Data Collection Platform',
    description: 'Geospatial data management system for city planning and land management. Features include digital map creation, GeoJSON processing, and cross-department collaboration tools.',
    tags: ['Leaflet.js', 'Google Maps API', 'Laravel', 'MySQL', 'Vue 3'],
    image: null,
    video: null,
    link: '#',
  },
  {
    id: 4,
    title: 'Corporate Research Portal',
    description: 'Full-stack marketing research platform with real-time data visualization, consumer behavior analytics, and automated reporting. Built with a responsive SPA architecture.',
    tags: ['Laravel 12', 'Vue 3', 'Inertia.js', 'Tailwind CSS', 'MySQL'],
    image: null,
    video: null,
    link: '#',
  },
  {
    id: 5,
    title: 'Hybrid Mobile Survey App',
    description: 'Cross-platform mobile application for offline field surveys with GPS tagging, photo capture, and background sync to the central research database.',
    tags: ['Ionic', 'Cordova', 'Vue 3', 'Laravel', 'Leaflet.js'],
    image: null,
    video: null,
    link: '#',
  },
  {
    id: 6,
    title: 'WordPress Corporate Website',
    description: 'Custom WordPress theme development with advanced plugin integration, SEO optimization, and performance tuning for improved user engagement and search rankings.',
    tags: ['WordPress', 'PHP', 'JavaScript', 'SEO', 'CSS'],
    image: null,
    video: null,
    link: '#',
  },
]

export default projects
