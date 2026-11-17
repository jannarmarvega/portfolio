// Vercel serverless function: emails a visitor's message to the site owner.
// The recipient address lives only in env vars, never in the client bundle.
//
// Required env vars (Vercel → Project → Settings → Environment Variables):
//   GMAIL_USER          Gmail address that sends the mail
//   GMAIL_APP_PASSWORD  16-character Google app password for that account
// Optional:
//   CONTACT_TO          where messages are delivered (defaults to GMAIL_USER)
import nodemailer from 'nodemailer'

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {}
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const subject = String(body.subject || '').trim()
  const message = String(body.message || '').trim()

  // Honeypot: real visitors never see or fill this field. Pretend success for bots.
  if (body.website) return res.status(200).json({ ok: true })

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in your name, email and message.' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }
  for (const [key, max] of Object.entries(LIMITS)) {
    if ({ name, email, subject, message }[key].length > max) {
      return res.status(400).json({ error: `The ${key} is too long (max ${max} characters).` })
    }
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('contact: GMAIL_USER / GMAIL_APP_PASSWORD are not set')
    return res.status(500).json({ error: 'Messaging is not set up yet. Please try again later.' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  })

  const cleanName = name.replace(/[\r\n]+/g, ' ')
  const title = subject ? subject.replace(/[\r\n]+/g, ' ') : `Message from ${cleanName}`

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${GMAIL_USER}>`,
      to: CONTACT_TO || GMAIL_USER,
      replyTo: `"${cleanName.replace(/"/g, '')}" <${email}>`,
      subject: `[Portfolio] ${title}`,
      text: `From: ${cleanName} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(cleanName)} &lt;${escapeHtml(email)}&gt;</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
<hr><p style="color:#888;font-size:12px">Sent from the contact form on your portfolio. Reply to this email to answer ${escapeHtml(cleanName)} directly.</p>`,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('contact: send failed', err)
    return res.status(502).json({ error: 'Your message could not be sent. Please try again later.' })
  }
}

function safeJson(s) {
  try {
    return JSON.parse(s)
  } catch {
    return {}
  }
}
