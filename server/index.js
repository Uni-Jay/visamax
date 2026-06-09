import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import Datastore from 'nedb-promises'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 8787)
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-this-admin-key'
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'change-this-verify-token'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const reviewsDb = Datastore.create({
  filename: path.join(__dirname, 'data', 'reviews.db'),
  autoload: true,
})

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const mapReview = (doc) => ({
  id: doc._id,
  name: doc.name,
  service: doc.service || 'General Review',
  text: doc.text,
  rating: Number(doc.rating || 5),
  status: doc.status,
  source: doc.source,
  phone: doc.phone,
  createdAt: doc.createdAt,
})

const requireAdmin = (req, res, next) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/reviews', async (_req, res) => {
  const docs = await reviewsDb.find({ status: 'approved' }).sort({ createdAt: -1 })
  res.json(docs.map(mapReview))
})

app.get('/api/admin/reviews', requireAdmin, async (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : 'pending'
  const query = status === 'all' ? {} : { status }
  const docs = await reviewsDb.find(query).sort({ createdAt: -1 })
  res.json(docs.map(mapReview))
})

app.patch('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const updated = await reviewsDb.update(
    { _id: id },
    { $set: { status, reviewedAt: new Date().toISOString() } },
    { returnUpdatedDocs: true },
  )

  if (!updated || !updated._id) {
    return res.status(404).json({ error: 'Review not found' })
  }

  res.json(mapReview(updated))
})

app.get('/api/webhooks/whatsapp', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge)
  }

  res.sendStatus(403)
})

app.post('/api/webhooks/whatsapp', async (req, res) => {
  try {
    const entries = Array.isArray(req.body?.entry) ? req.body.entry : []

    for (const entry of entries) {
      const changes = Array.isArray(entry?.changes) ? entry.changes : []
      for (const change of changes) {
        const value = change?.value || {}
        const contacts = Array.isArray(value.contacts) ? value.contacts : []
        const messages = Array.isArray(value.messages) ? value.messages : []
        const profileName = contacts[0]?.profile?.name || 'WhatsApp User'

        for (const message of messages) {
          const text = message?.text?.body?.trim()
          if (!text) {
            continue
          }

          await reviewsDb.insert({
            name: profileName,
            service: 'WhatsApp Review',
            text,
            rating: 5,
            status: 'pending',
            source: 'whatsapp',
            phone: message?.from || '',
            createdAt: new Date().toISOString(),
          })
        }
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error('Webhook error', error)
    res.sendStatus(500)
  }
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
