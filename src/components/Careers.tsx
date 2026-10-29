import { useEffect, useState } from 'react'
import './careers.css'

/**
 * Job openings posted in MaxHub (the company workspace) for this brand.
 * Post, edit or close a job in MaxHub and it updates here automatically;
 * applications go straight to HR in MaxHub.
 */
const API: string = (import.meta.env.VITE_MAXHUB_API as string | undefined) || 'https://maxhub-backend.onrender.com/api/public'

interface Job {
  code: string; title: string; description?: string; jobType?: string; positions?: number; location?: string
  salaryMin?: number; salaryMax?: number; currency?: string; experience?: string; qualifications?: string
  skills?: string; benefits?: string; closingDate?: string
}

const money = (n?: number, c = 'NGN') => (n ? `${c === 'NGN' ? '₦' : `${c} `}${Number(n).toLocaleString('en-NG')}` : '')
const pay = (j: Job) => (j.salaryMin && j.salaryMax ? `${money(j.salaryMin, j.currency)} – ${money(j.salaryMax, j.currency)}` : money(j.salaryMin || j.salaryMax, j.currency))
const lines = (s?: string) => String(s || '').split(/\n|•|;/).map((x) => x.trim()).filter(Boolean)

export default function Careers({ brand, title = 'Careers', intro }: { brand: 'VM' | 'KS' | 'BM' | 'MF'; title?: string; intro?: string }) {
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState<Job | null>(null)

  useEffect(() => {
    fetch(`${API}/jobs?brand=${brand}`).then((r) => r.json()).then((b) => setJobs(b.data || [])).catch(() => setError(true))
  }, [brand])

  return (
    <div className="mx-careers">
      <header className="mx-head">
        <p className="mx-eyebrow">{jobs && jobs.length ? "We're hiring" : 'Join us'}</p>
        <h1>{title}</h1>
        <p>{intro || 'Grow your career with a team that cares about quality and people. See our open roles below.'}</p>
      </header>

      {error && <p className="mx-empty">We couldn't load our openings right now. Please try again later.</p>}
      {!error && jobs === null && <div className="mx-list">{[0, 1, 2].map((i) => <div key={i} className="mx-job mx-skeleton" />)}</div>}
      {jobs && !jobs.length && <p className="mx-empty">There are no open positions at the moment. Follow us on social media to hear about new roles first.</p>}

      {jobs && jobs.length > 0 && (
        <div className="mx-list">
          {jobs.map((j) => (
            <article key={j.code} className="mx-job">
              <div className="mx-job-main">
                <h3>{j.title}</h3>
                <p className="mx-meta">
                  {[j.jobType, j.location, j.positions && j.positions > 1 ? `${j.positions} openings` : '', j.experience].filter(Boolean).join(' · ')}
                </p>
                {pay(j) && <p className="mx-pay">{pay(j)}</p>}
              </div>
              <div className="mx-job-side">
                {j.closingDate && <p className="mx-close">Apply by {new Date(j.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                <button className="mx-btn" onClick={() => setOpen(j)}>View &amp; apply</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {open && <JobModal job={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', resumeUrl: '', coverLetter: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setState('sending')
    try {
      const r = await fetch(`${API}/jobs/${encodeURIComponent(job.code)}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const b = await r.json().catch(() => ({}))
      if (!r.ok || b.success === false) throw new Error(b.message || 'Could not send your application')
      setState('sent')
    } catch (err) { setError((err as Error).message); setState('idle') }
  }

  return (
    <div className="mx-overlay" onClick={onClose}>
      <div className="mx-modal" role="dialog" aria-modal="true" aria-label={job.title} onClick={(e) => e.stopPropagation()}>
        <button className="mx-x" onClick={onClose} aria-label="Close">×</button>
        <h2>{job.title}</h2>
        <p className="mx-meta">{[job.jobType, job.location, pay(job)].filter(Boolean).join(' · ')}</p>
        {job.description && <p className="mx-desc">{job.description}</p>}
        {lines(job.qualifications).length > 0 && <><h4>What you need</h4><ul>{lines(job.qualifications).map((l) => <li key={l}>{l}</li>)}</ul></>}
        {lines(job.skills).length > 0 && <><h4>Skills</h4><ul>{lines(job.skills).map((l) => <li key={l}>{l}</li>)}</ul></>}
        {lines(job.benefits).length > 0 && <><h4>What we offer</h4><ul>{lines(job.benefits).map((l) => <li key={l}>{l}</li>)}</ul></>}

        {state === 'sent' ? (
          <div className="mx-sent"><b>Thank you — your application has been received.</b><p>Our HR team will contact you if you are shortlisted.</p></div>
        ) : (
          <form className="mx-form" onSubmit={submit}>
            <h4>Apply for this role</h4>
            <label>Full name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" /></label>
            <div className="mx-row">
              <label>Email<input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></label>
              <label>Phone<input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} inputMode="tel" autoComplete="tel" /></label>
            </div>
            <label>Link to your CV (Google Drive, Dropbox, LinkedIn…)<input type="url" placeholder="https://" value={f.resumeUrl} onChange={(e) => setF({ ...f, resumeUrl: e.target.value })} /></label>
            <label>Why you? (optional)<textarea rows={4} value={f.coverLetter} onChange={(e) => setF({ ...f, coverLetter: e.target.value })} /></label>
            {error && <p className="mx-error" role="alert">{error}</p>}
            <button className="mx-btn mx-wide" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send application'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
