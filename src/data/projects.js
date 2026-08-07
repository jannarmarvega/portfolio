// `video` accepts a YouTube link/ID (https://youtu.be/ID, watch?v=ID, /shorts/ID, or the bare ID)
// or a self-hosted file served from /public (e.g. '/videos/survey-builder.mp4').
// `image` doubles as the poster frame when a video is set. Leave `video: null` for the icon card.
// `demo` config: { type: 'chatbot' | 'playground', config: {...} }. Leave as null for no demo.
export const projects = [
  {
    id: 10,
    title: 'SSR / Impulse',
    description: 'Real-time survey data collection platform with advanced conditional logic, dynamic question routing, and interactive chart previews. Built for Split Second Research.',
    tags: ['Laravel', 'Vue 3', 'Inertia.js', 'Tailwind CSS', 'MySQL', 'Chart.js'],
    image: null,
    video: null,
    link: '#',
    demo: {
      type: 'playground',
      config: {
        defaultHtml: '<div id="survey-preview">\n  <h2>Customer Feedback Survey</h2>\n  <div class="question">\n    <label>How satisfied are you with our service?</label>\n    <div class="star-rating">★★★★☆</div>\n  </div>\n  <button class="btn-primary">Submit</button>\n</div>',
        defaultCss: '#survey-preview {\n  max-width: 400px;\n  margin: 0 auto;\n  font-family: Inter, system-ui;\n}\nh2 { color: #6c63ff; font-size: 1.4rem; }\n.question { margin: 20px 0; padding: 16px; background: #f8f9fa; border-radius: 8px; }\nlabel { display: block; margin-bottom: 8px; font-weight: 500; color: #333; }\n.star-rating { font-size: 1.5rem; color: #f59e0b; cursor: pointer; user-select: none; }\n.btn-primary { padding: 10px 24px; background: #6c63ff; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }\n.btn-primary:hover { background: #5a52d5; }',
        defaultJs: 'const stars = document.querySelector(\'.star-rating\');\nif (stars) {\n  stars.addEventListener(\'mouseover\', () => {\n    stars.textContent = \'★★★★★\';\n  });\n  stars.addEventListener(\'mouseout\', () => {\n    stars.textContent = \'★★★★☆\';\n  });\n}\ndocument.querySelector(\'.btn-primary\').addEventListener(\'click\', () => {\n  alert(\'Survey submitted successfully!\');\n});',
      },
    },
  },
  {
    id: 11,
    title: 'SSR / Impact',
    description: 'AI-integrated research platform featuring intelligent data analysis, automated insight generation, and an interactive chatbot for querying survey results in natural language. Built for Split Second Research.',
    tags: ['Laravel', 'Vue 3', 'Inertia.js', 'OpenAI', 'Groq LLM', 'Laravel Prism'],
    image: null,
    video: null,
    link: '#',
    demo: {
      type: 'chatbot',
      config: {
        systemPrompt: 'You are a demo chatbot for the SSR/Impact platform — an AI-integrated research platform by Split Second Research. You help users understand survey analytics, generate insights, and answer questions about market research data analysis. Keep responses concise (2-4 sentences), professional, and highlight the platform\'s AI-powered features.',
        greeting: 'Welcome to SSR/Impact! I\'m your AI-powered research assistant. I can help you analyze survey responses, generate insights, and answer questions about your research data. Try asking me something!',
        placeholder: 'Ask about survey insights, data trends, or analysis features...',
      },
    },
  },
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
  {
    id: 12,
    title: 'GIS Map Editor',
    description: 'Interactive map editor built with Vue 3 and Leaflet.js. Create and edit points, draw polygons, record GPS tracks in real-time with live location tracking, and export all features as GeoJSON. Includes localStorage persistence for all map data.',
    tags: ['Vue 3', 'Leaflet.js', 'Geolocation', 'GeoJSON', 'localStorage'],
    image: null,
    video: null,
    link: 'https://github.com/jannarmarvega/GIS',
  },
]

export default projects
