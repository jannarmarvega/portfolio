// Generates public/Jann_Vega_Resume.docx straight from the portfolio's own content.
// Every line below comes from src/data/* — the same source the site renders.
// Edit the data files, re-run `node scripts/generate-resume.mjs`, and the resume follows.
import { Document, Packer, Paragraph, TextRun, BorderStyle } from 'docx'
import fs from 'fs'

import { personalInfo } from '../src/data/personal.js'
import { experience } from '../src/data/experience.js'
import { projects } from '../src/data/projects.js'
import { social, education, certifications } from '../src/data/social.js'

const ACCENT = '6c63ff'

// Same category labels the About section uses.
const skillCategories = [
  { name: 'Stacks', items: personalInfo.skills.stacks },
  { name: 'Frontend', items: personalInfo.skills.frontend },
  { name: 'Backend', items: personalInfo.skills.backend },
  { name: 'AI & Automation', items: personalInfo.skills.ai },
  { name: 'Geospatial', items: personalInfo.skills.geospatial },
  { name: 'Mobile', items: personalInfo.skills.mobile },
  { name: 'Cloud', items: personalInfo.skills.cloud },
  { name: 'Infrastructure', items: personalInfo.skills.infrastructure },
  { name: 'Tools', items: personalInfo.skills.tools },
]

function sectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color: ACCENT })],
    spacing: { before: 260, after: 120 },
    border: { bottom: { color: ACCENT, size: 2, space: 4, style: BorderStyle.SINGLE } },
  })
}

function line(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: opts.size ?? 19, color: opts.color ?? '555555', bold: opts.bold })],
    spacing: { after: opts.after ?? 24 },
  })
}

function skillLine({ name, items }) {
  return new Paragraph({
    children: [
      new TextRun({ text: name + ': ', bold: true, size: 19 }),
      new TextRun({ text: items.join(', '), size: 19, color: '555555' }),
    ],
    spacing: { after: 24 },
  })
}

function experienceItem(job) {
  const meta = [job.location, job.type, job.duration].filter(Boolean).join('  ·  ')
  const out = [
    new Paragraph({
      children: [new TextRun({ text: job.role, bold: true, size: 21 })],
      spacing: { after: 20 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: job.company, size: 19, color: ACCENT }),
        new TextRun({ text: '    ' + job.period, size: 19, color: '888888' }),
      ],
      spacing: { after: meta ? 20 : 60 },
    }),
  ]

  if (meta) out.push(line(meta, { size: 18, color: '888888', after: 60 }))

  job.highlights.forEach(h => {
    out.push(new Paragraph({
      children: [new TextRun({ text: '•  ' + h, size: 19, color: '555555' })],
      spacing: { after: 24 },
      indent: { left: 360 },
    }))
  })

  out.push(new Paragraph({ spacing: { after: 120 }, children: [] }))
  return out
}

function projectItem(project) {
  const runs = [
    new TextRun({ text: project.title + '  ', bold: true, size: 20 }),
    new TextRun({ text: project.description, size: 19, color: '555555' }),
    new TextRun({ text: '  [' + project.tags.join('  ·  ') + ']', size: 17, color: ACCENT, italics: true }),
  ]
  if (project.link && project.link !== '#') {
    runs.push(new TextRun({ text: '  ' + project.link.replace(/^https?:\/\//, ''), size: 17, color: '888888' }))
  }
  if (project.github) {
    runs.push(new TextRun({ text: '  ' + project.github.replace(/^https?:\/\//, ''), size: 17, color: '888888' }))
  }
  return new Paragraph({ children: runs, spacing: { after: 80 } })
}

const contactLine = [personalInfo.location, personalInfo.email, personalInfo.phone].join('  |  ')
const linksLine = [
  social.github.replace(/^https?:\/\//, ''),
  'linkedin.com/in/jann-niño-armar-vega',
  personalInfo.website,
].join('  |  ')
const statsLine = personalInfo.stats.map(s => `${s.value} ${s.label}`).join('  ·  ')

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: 720, bottom: 720, left: 864, right: 864 } } },
    children: [
      new Paragraph({ children: [new TextRun({ text: personalInfo.name, bold: true, size: 44 })] }),
      new Paragraph({
        children: [new TextRun({ text: personalInfo.title, size: 26, color: ACCENT })],
        spacing: { after: 120 },
      }),
      line(contactLine, { color: '666666', after: 60 }),
      line(linksLine, { size: 18, color: ACCENT, after: 60 }),
      line(statsLine, { size: 18, color: '888888', after: 220 }),

      sectionHeading('Professional Summary'),
      ...personalInfo.summary.map((para, i) =>
        line(para, { size: 20, color: '444444', after: i === personalInfo.summary.length - 1 ? 0 : 60 })
      ),

      sectionHeading('Skills & Technologies'),
      ...skillCategories.map(skillLine),

      sectionHeading('Work Experience'),
      ...experience.flatMap(experienceItem),

      sectionHeading('Projects'),
      ...projects.map(projectItem),

      sectionHeading('Education & Certifications'),
      new Paragraph({
        children: [
          new TextRun({ text: education.degree, bold: true, size: 21 }),
          new TextRun({ text: `  —  ${education.school}  ·  ${education.period}`, size: 19, color: '666666' }),
        ],
        spacing: { after: 80 },
      }),
      line(certifications.join('  |  '), { after: 40 }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Top 10% PHP — TestDome', bold: true, size: 19, color: ACCENT }),
          new TextRun({ text: '    ', size: 19 }),
          new TextRun({ text: 'Top 10% JavaScript — TestDome', bold: true, size: 19, color: ACCENT }),
        ],
        spacing: { after: 0 },
      }),
    ],
  }],
})

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('public/Jann_Vega_Resume.docx', buffer)
  console.log('Resume saved to public/Jann_Vega_Resume.docx')
})
