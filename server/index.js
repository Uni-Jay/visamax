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

const jobsDb = Datastore.create({
  filename: path.join(__dirname, 'data', 'jobs.db'),
  autoload: true,
})

const JOB_SYNC_VM_API_KEY = process.env.JOB_SYNC_VM_API_KEY || ''

const JOB_FIELDS = [
  'title', 'description', 'jobType', 'noOfPositions', 'location',
  'salaryMin', 'salaryMax', 'currency', 'requiredExperience',
  'qualifications', 'skills', 'benefits', 'postedDate', 'closingDate', 'status',
]

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

const mapJob = (doc) => ({
  id: doc._id,
  source: doc.source,
  externalRef: doc.externalRef || null,
  title: doc.title,
  description: doc.description || '',
  jobType: doc.jobType || '',
  noOfPositions: Number(doc.noOfPositions || 1),
  location: doc.location || '',
  salaryMin: doc.salaryMin ?? null,
  salaryMax: doc.salaryMax ?? null,
  currency: doc.currency || 'NGN',
  requiredExperience: doc.requiredExperience || '',
  qualifications: doc.qualifications || '',
  skills: doc.skills || '',
  benefits: doc.benefits || '',
  postedDate: doc.postedDate,
  closingDate: doc.closingDate,
  status: doc.status || 'Open',
  createdAt: doc.createdAt,
})

const pick = (obj, keys) => keys.reduce((acc, key) => {
  if (obj[key] !== undefined) acc[key] = obj[key]
  return acc
}, {})

const requireJobSync = (req, res, next) => {
  const header = req.headers['authorization'] || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!JOB_SYNC_VM_API_KEY || token !== JOB_SYNC_VM_API_KEY) {
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

// ── Public: Career page reads open jobs from here ──────────────────
app.get('/api/jobs', async (req, res) => {
  const { source } = req.query
  const query = { status: 'Open' }
  if (source === 'manual' || source === 'maxhub') {
    query.source = source
  }

  const docs = await jobsDb.find(query).sort({ postedDate: -1 })
  const visible = docs.filter(
    (doc) => !doc.closingDate || new Date(doc.closingDate).getTime() >= Date.now(),
  )
  res.json(visible.map(mapJob))
})

// ── MaxHub ERP job-sync receiver ────────────────────────────────────
// Implements the placeholder contract from JobSyncService.ts: HR posts a job
// in MaxHub, a Super Admin approves it (Draft -> Open), and that transition
// pushes it here with `Authorization: Bearer <JOB_SYNC_VM_API_KEY>`.
app.post('/api/jobs', requireJobSync, async (req, res) => {
  const body = req.body || {}
  const externalRef = body.externalRef ? String(body.externalRef) : undefined

  if (externalRef) {
    const existing = await jobsDb.findOne({ source: 'maxhub', externalRef })
    if (existing) {
      const updated = await jobsDb.update(
        { _id: existing._id },
        { $set: { ...pick(body, JOB_FIELDS), updatedAt: new Date().toISOString() } },
        { returnUpdatedDocs: true },
      )
      return res.status(200).json({ id: updated._id })
    }
  }

  const doc = await jobsDb.insert({
    ...pick(body, JOB_FIELDS),
    externalRef: externalRef || null,
    source: 'maxhub',
    status: body.status || 'Open',
    createdAt: new Date().toISOString(),
  })
  res.status(201).json({ id: doc._id })
})

app.put('/api/jobs/:id', requireJobSync, async (req, res) => {
  const { id } = req.params
  const updated = await jobsDb.update(
    { _id: id, source: 'maxhub' },
    { $set: { ...pick(req.body || {}, JOB_FIELDS), updatedAt: new Date().toISOString() } },
    { returnUpdatedDocs: true },
  )

  if (!updated || !updated._id) {
    return res.status(404).json({ error: 'Job not found' })
  }

  res.json(mapJob(updated))
})

app.delete('/api/jobs/:id', requireJobSync, async (req, res) => {
  const { id } = req.params
  const removed = await jobsDb.remove({ _id: id, source: 'maxhub' })

  if (!removed) {
    return res.status(404).json({ error: 'Job not found' })
  }

  res.sendStatus(204)
})

// ── Admin: manually-uploaded "work visa jobs abroad" listings ──────
app.get('/api/admin/jobs', requireAdmin, async (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : 'all'
  const query = { source: 'manual' }
  if (status !== 'all') {
    query.status = status
  }

  const docs = await jobsDb.find(query).sort({ createdAt: -1 })
  res.json(docs.map(mapJob))
})

app.post('/api/admin/jobs', requireAdmin, async (req, res) => {
  const body = req.body || {}
  if (!body.title || !body.postedDate || !body.closingDate) {
    return res.status(400).json({ error: 'title, postedDate, and closingDate are required' })
  }

  const doc = await jobsDb.insert({
    ...pick(body, JOB_FIELDS),
    source: 'manual',
    externalRef: null,
    status: body.status || 'Open',
    createdAt: new Date().toISOString(),
  })
  res.status(201).json(mapJob(doc))
})

app.patch('/api/admin/jobs/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  const existing = await jobsDb.findOne({ _id: id })
  if (!existing) {
    return res.status(404).json({ error: 'Job not found' })
  }
  if (existing.source !== 'manual') {
    return res.status(400).json({ error: 'This listing is managed by MaxHub sync and cannot be edited here.' })
  }

  const updated = await jobsDb.update(
    { _id: id },
    { $set: { ...pick(req.body || {}, JOB_FIELDS), updatedAt: new Date().toISOString() } },
    { returnUpdatedDocs: true },
  )
  res.json(mapJob(updated))
})

app.delete('/api/admin/jobs/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  const existing = await jobsDb.findOne({ _id: id })
  if (!existing) {
    return res.status(404).json({ error: 'Job not found' })
  }
  if (existing.source !== 'manual') {
    return res.status(400).json({ error: 'This listing is managed by MaxHub sync and cannot be deleted here.' })
  }

  await jobsDb.remove({ _id: id })
  res.sendStatus(204)
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
