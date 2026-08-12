import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, TabStopPosition, TabStopType, BorderStyle,
  WidthType, SectionType
} from 'docx'
import fs from 'fs'

const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: { top: 720, bottom: 720, left: 864, right: 864 }
      }
    },
    children: [

      new Paragraph({ children: [new TextRun({ text: 'Jann Niño Armar Vega', bold: true, size: 44 })] }),
      new Paragraph({
        children: [new TextRun({ text: 'Solution Architect', size: 26, color: '6c63ff' })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Malaybalay City, Northern Mindanao, Philippines  |  jannarmarvega@gmail.com  |  09525567486', size: 19, color: '666666' })
        ],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'github.com/jannvega102  |  LinkedIn  |  jannvega102.github.io/myportfolio', size: 18, color: '6c63ff' })
        ],
        spacing: { after: 200 }
      }),

      new Paragraph({
        children: [new TextRun({ text: 'Solution Architect with over 7 years of experience designing and delivering scalable software solutions across web, mobile, and geospatial platforms. Dual-stack expert in VILT (Vue 3, Inertia.js, Laravel, Tailwind) and MERN (MongoDB, Express, React, Node.js), with deep expertise in AI/LLM integration, cloud deployment (Vercel, Supabase), and modern frontend frameworks (Nuxt 3, TypeScript). Ranked Top 10% globally in both PHP and JavaScript (TestDome).', size: 20, color: '444444' })],
        spacing: { after: 280 }
      }),

      sectionHeading('Technical Skills'),

      skillLine('Stacks:', 'VILT (Vue 3, Inertia.js, Laravel, Tailwind), MERN (MongoDB, Express, React, Node.js), Nuxt 3 + Prisma + Supabase'),
      skillLine('Frontend:', 'Vue 3 / Nuxt, React, Tailwind CSS, Inertia.js, TypeScript, Pinia'),
      skillLine('Backend:', 'PHP (Laravel), Python (Django, FastAPI), Node.js, RESTful APIs'),
      skillLine('AI & ML:', 'LLM Integration, OpenAI, Groq, Chatbots, Predictive Analysis, Laravel Prism'),
      skillLine('Geospatial:', 'Leaflet.js, Google Maps API, GIS Mapping, GeoJSON'),
      skillLine('Mobile:', 'Ionic, Capacitor, Cordova, Hybrid App Development'),
      skillLine('Cloud:', 'Vercel, Supabase, GitHub Actions, CI/CD, Docker'),
      skillLine('Infrastructure:', 'MySQL, MongoDB, Prisma ORM, Git, Laravel Octane, Laravel Reverb'),
      skillLine('Tools:', 'WordPress, SEO, PayMongo, Pusher / WebSocket, Bash Scripting'),

      sectionHeading('Work Experience'),

      experienceItem(
        'Full Stack Web Developer',
        'Split Second Research Limited  |  London Area, UK (Remote)',
        'Aug 2018 – Present  ·  Full-time',
        [
          'Architected and developed an interactive marketing research survey system using Laravel 12, Vue 3, Inertia.js, and Tailwind CSS, enabling efficient data collection and consumer behavior analysis.',
          'Integrated OpenAI and Groq LLMs for intelligent chatbot functionalities and automated insight generation.',
          'Built responsive single-page application features improving user experience and system performance for internal research tools.',
          'Maintained and enhanced company WordPress website with custom plugins, themes, and SEO optimizations.'
        ]
      ),

      experienceItem(
        'Geological Information System Specialist',
        'Malaybalay City Hall  |  Malaybalay City, Philippines',
        'Jun 2020 – May 2022  ·  Full-time',
        [
          'Managed geospatial data and GIS mapping systems to support city planning, land management, and local government projects.',
          'Created and analyzed digital maps and geographic datasets, collaborating with departments to improve spatial data accuracy.'
        ]
      ),

      experienceItem(
        'Programmer',
        'NeuroSense  |  United Kingdom (Remote)',
        'Apr 2016 – Jun 2018  ·  Full-time',
        [
          'Developed and maintained web-based applications ensuring efficient performance and scalability.',
          'Implemented backend and frontend functionalities using modern web technologies.',
          'Collaborated with team to debug, optimize, and enhance software solutions.'
        ]
      ),

      sectionHeading('Key Projects'),

      projectItem('SSR / Impact — AI Research Platform', 'AI-integrated research platform with intelligent data analysis, automated insights, and natural language chatbot for querying survey results.', 'Laravel  ·  Vue 3  ·  OpenAI  ·  Groq LLM  ·  Laravel Prism'),
      projectItem('SSR / Impulse — Survey Collection', 'Real-time survey data collection platform with conditional logic, dynamic routing, and interactive chart previews.', 'Laravel  ·  Vue 3  ·  Inertia.js  ·  Tailwind CSS  ·  Chart.js'),
      projectItem('Interactive Survey Builder', 'Drag-and-drop survey builder with conditional logic, GIS mapping via Leaflet.js, and AI-driven automation.', 'Laravel  ·  Vue 3  ·  Leaflet.js  ·  OpenAI'),
      projectItem('GIS Mapping & Data Collection Platform', 'Geospatial data management for city planning with digital maps, GeoJSON processing, and cross-department collaboration.', 'Leaflet.js  ·  Google Maps API  ·  Laravel  ·  MySQL'),
      projectItem('Hybrid Mobile Survey App', 'Cross-platform mobile app for offline surveys with GPS tagging, photo capture, and background sync.', 'Ionic  ·  Capacitor  ·  Cordova  ·  Laravel  ·  Leaflet.js'),
      projectItem('GIS Map Editor', 'Interactive map editor with live location tracking, polygon drawing, and GeoJSON export. Deployed on Vercel.', 'Vue 3  ·  Leaflet.js  ·  Geolocation  ·  GeoJSON'),
      projectItem('AI-Powered Chatbot Platform', 'Intelligent chatbot system with OpenAI LLMs for automated support, content generation, and real-time data analysis.', 'Laravel  ·  OpenAI  ·  Vue 3  ·  Laravel Prism'),
      projectItem('WordPress Corporate Website', 'Custom theme with advanced plugins, SEO optimization, and performance tuning.', 'WordPress  ·  PHP  ·  JavaScript  ·  SEO'),

      sectionHeading('Education & Certifications'),
      new Paragraph({
        children: [
          new TextRun({ text: "Associate's Degree in Information Technology", bold: true, size: 21 }),
          new TextRun({ text: '  —  STI College  ·  2014 – 2016', size: 19, color: '666666' })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Fundamentals of Digital Marketing  |  Vue.js  |  ESL Teaching  |  QuickBooks Online', size: 19, color: '555555' })
        ],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Top 10% PHP — TestDome', bold: true, size: 19, color: '6c63ff' }),
          new TextRun({ text: '    ', size: 19 }),
          new TextRun({ text: 'Top 10% JavaScript — TestDome', bold: true, size: 19, color: '6c63ff' })
        ],
        spacing: { after: 0 }
      }),
    ]
  }]
})

function sectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color: '6c63ff' })],
    spacing: { before: 280, after: 120 },
    border: { bottom: { color: '6c63ff', size: 2, space: 4, style: BorderStyle.SINGLE } }
  })
}

function skillLine(label, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: label + ' ', bold: true, size: 19 }),
      new TextRun({ text: value, size: 19, color: '555555' })
    ],
    spacing: { after: 24 }
  })
}

function experienceItem(title, subtitle, date, bullets) {
  const children = [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 21 })],
      spacing: { after: 20 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: subtitle, size: 19, color: '6c63ff' }),
        new TextRun({ text: '    ' + date, size: 19, color: '888888' })
      ],
      spacing: { after: 60 }
    }),
  ]

  bullets.forEach(b => {
    children.push(new Paragraph({
      children: [new TextRun({ text: '•  ' + b, size: 19, color: '555555' })],
      spacing: { after: 24 },
      indent: { left: 360 }
    }))
  })

  children.push(new Paragraph({ spacing: { after: 120 }, children: [] }))
  return children
}

function projectItem(title, desc, tags) {
  return new Paragraph({
    children: [
      new TextRun({ text: title + '  ', bold: true, size: 20 }),
      new TextRun({ text: desc, size: 19, color: '555555' }),
      new TextRun({ text: '  [' + tags + ']', size: 17, color: '6c63ff', italics: true })
    ],
    spacing: { after: 80 }
  })
}

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('public/Jann_Vega_Resume.docx', buffer)
  console.log('Resume saved to public/Jann_Vega_Resume.docx')
})
