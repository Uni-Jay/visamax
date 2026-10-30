import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

/**
 * Consultation booking powered by MaxHub (the VisaMax team workspace).
 * Shows real free times; the booking lands straight in the team's calendar
 * and the client gets an email confirmation and a reminder the day before.
 */
const API: string = (import.meta.env.VITE_MAXHUB_API as string | undefined) || 'https://maxhub-backend.onrender.com/api/public'
const BRAND = 'VM'

interface Service { name: string; minutes: number; modes: string[] }
interface Options { enabled: boolean; intro?: string; services: Service[]; location?: string; videoNote?: string; days: Array<{ date: string; open: boolean; closed?: string }> }
interface Done { code: string; when: string; service: string; mode: string }

const field = 'w-full border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]'
const dayLabel = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
const timeLabel = (t: string) => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }

export default function BookingForm({ fallbackServices }: { fallbackServices: string[] }) {
  const manage = new URLSearchParams(window.location.search).get('manage')
  const [opts, setOpts] = useState<Options | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', mode: '', date: '', time: '', notes: '' })
  const [slots, setSlots] = useState<string[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<Done | null>(null)

  useEffect(() => {
    if (manage) return
    fetch(`${API}/bookings/${BRAND}/options`).then((r) => r.json()).then((b) => {
      const o: Options = b.data
      setOpts(o)
      if (o?.enabled && o.services.length) setForm((f) => ({ ...f, service: o.services[0].name, mode: o.services[0].modes[0] || 'In person' }))
    }).catch(() => setOpts({ enabled: false, services: [], days: [] }))
  }, [manage])

  const svc = useMemo(() => opts?.services.find((s) => s.name === form.service) || null, [opts, form.service])

  useEffect(() => {
    if (!form.date || !form.service) { setSlots(null); return }
    setSlots(null)
    fetch(`${API}/bookings/${BRAND}/slots?date=${form.date}&service=${encodeURIComponent(form.service)}`).then((r) => r.json()).then((b) => setSlots(b.data?.slots || [])).catch(() => setSlots([]))
  }, [form.date, form.service])

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      const r = await fetch(`${API}/bookings/${BRAND}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const b = await r.json()
      if (!r.ok || b.success === false) {
        setError(b.message || 'Something went wrong. Please try again.')
        if (r.status === 409) setForm((f) => ({ ...f, time: '' }))
        setSlots(null); setForm((f) => ({ ...f, date: f.date })) // refresh times
        fetch(`${API}/bookings/${BRAND}/slots?date=${form.date}&service=${encodeURIComponent(form.service)}`).then((x) => x.json()).then((x) => setSlots(x.data?.slots || []))
      } else setDone(b.data)
    } catch { setError('We could not reach our booking system. Please call +234 817 002 0431.') }
    setBusy(false)
  }

  if (manage) return <ManageBooking token={manage} />

  if (done) return (
    <div className="rounded-2xl border border-[#c8102e]/20 bg-[#fff5f7] p-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#c8102e]">Appointment Confirmed</p>
      <h2 className="mt-2 text-2xl font-black text-[#002b6c]">Thank you, {form.name.split(' ')[0] || 'Client'}.</h2>
      <p className="mt-3 text-slate-700">Your <strong>{done.service}</strong> consultation is booked for <strong>{done.when}</strong> ({done.mode.toLowerCase()}).</p>
      <p className="mt-2 text-sm text-slate-600">We have emailed the details to <strong>{form.email}</strong>, with a link to cancel or rebook. Your reference is <strong>{done.code}</strong>.</p>
      <button type="button" onClick={() => { setDone(null); setForm({ ...form, date: '', time: '', notes: '' }) }} className="mt-5 inline-flex items-center rounded-full bg-[#002b6c] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#001a45]">Book Another</button>
    </div>
  )

  if (!opts) return <div className="py-16 text-center text-slate-500">Loading available times…</div>

  if (!opts.enabled || !opts.services.length) return (
    <div className="space-y-3 text-slate-700">
      <h2 className="mb-2 border-b-2 border-[#c8102e] pb-3 text-2xl font-black text-[#002b6c]">Book a consultation</h2>
      <p>Online booking is not available right now. Please call <a className="font-bold text-[#c8102e]" href="tel:+2348170020431">+234 817 002 0431</a> or send us a message and we will arrange a time.</p>
      <p className="text-sm text-slate-500">Services: {fallbackServices.join(', ')}.</p>
    </div>
  )

  const openDays = opts.days.filter((d) => d.open)
  return (
    <form onSubmit={submit} className="min-w-0 space-y-5">
      <h2 className="mb-2 border-b-2 border-[#c8102e] pb-3 text-2xl font-black text-[#002b6c]">Consultation Details</h2>
      {opts.intro && <p className="text-sm text-slate-600">{opts.intro}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <select value={form.service} onChange={(e) => { const s = opts.services.find((x) => x.name === e.target.value); setForm({ ...form, service: e.target.value, mode: s?.modes.includes(form.mode) ? form.mode : s?.modes[0] || '', time: '' }) }} className={field}>
          {opts.services.map((s) => <option key={s.name} value={s.name}>{s.name} ({s.minutes} min)</option>)}
        </select>
        <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className={field}>
          {(svc?.modes || []).map((m) => <option key={m} value={m}>{m === 'In person' ? 'At our office' : m}</option>)}
        </select>
      </div>
      {form.mode === 'In person' && opts.location && <p className="-mt-2 text-xs text-slate-500">Office: {opts.location}</p>}
      {form.mode === 'Video call' && opts.videoNote && <p className="-mt-2 text-xs text-slate-500">{opts.videoNote}</p>}

      <div className="min-w-0">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#002b6c]">Choose a day</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {openDays.slice(0, 21).map((d) => (
            <button type="button" key={d.date} onClick={() => setForm({ ...form, date: d.date, time: '' })}
              className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-bold transition ${form.date === d.date ? 'border-[#002b6c] bg-[#002b6c] text-white' : 'border-slate-200 bg-[#f4f7fc] text-slate-700 hover:border-[#002b6c]'}`}>
              {dayLabel(d.date)}
            </button>
          ))}
        </div>
      </div>

      {form.date && (
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#002b6c]">Choose a time (Lagos time)</p>
          {slots === null ? <p className="text-sm text-slate-500">Checking free times…</p> : !slots.length ? <p className="text-sm text-slate-600">No free times left on this day — please pick another day.</p> : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((t) => (
                <button type="button" key={t} onClick={() => setForm({ ...form, time: t })}
                  className={`rounded-xl border px-2 py-2 text-sm font-bold transition ${form.time === t ? 'border-[#c8102e] bg-[#c8102e] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-[#c8102e]'}`}>
                  {timeLabel(t)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} placeholder="Full Name" />
        <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} placeholder="Phone Number" />
        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${field} md:col-span-2`} placeholder="Email Address" />
      </div>
      <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`min-h-28 ${field}`} placeholder="Tell us your travel plan, destination, and any deadlines..." />

      {error && <p className="rounded-xl bg-[#fff5f7] px-4 py-3 text-sm font-semibold text-[#c8102e]">{error}</p>}
      <button disabled={busy || !form.time} className="inline-flex w-full items-center justify-center rounded-full bg-[#c8102e] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#a30d26] disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? 'Booking…' : form.time ? `Book ${dayLabel(form.date)} at ${timeLabel(form.time)}` : 'Pick a day and time'}
      </button>
    </form>
  )
}

function ManageBooking({ token }: { token: string }) {
  const [b, setB] = useState<any | null>(null)
  const [msg, setMsg] = useState('')
  useEffect(() => { fetch(`${API}/bookings/manage/${token}`).then((r) => r.json()).then((x) => (x.success === false ? setMsg(x.message) : setB(x.data))).catch(() => setMsg('Could not load your booking.')) }, [token])
  const cancel = async () => {
    if (!confirm('Cancel this consultation?')) return
    const r = await fetch(`${API}/bookings/manage/${token}/cancel`, { method: 'POST' }).then((x) => x.json())
    if (r.success === false) setMsg(r.message); else setB({ ...b, status: 'Cancelled', canCancel: false })
  }
  if (msg) return <p className="text-slate-700">{msg}</p>
  if (!b) return <p className="py-10 text-center text-slate-500">Loading your booking…</p>
  return (
    <div className="space-y-4">
      <h2 className="border-b-2 border-[#c8102e] pb-3 text-2xl font-black text-[#002b6c]">Your booking</h2>
      <p className="text-slate-700"><strong>{b.service}</strong> — {b.when} ({String(b.mode).toLowerCase()})</p>
      <p className="text-sm text-slate-600">Reference {b.code} · Status: <strong>{b.status}</strong></p>
      {b.canCancel && <button onClick={cancel} className="inline-flex items-center rounded-full border-2 border-[#c8102e] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-[#c8102e] hover:bg-[#fff5f7]">Cancel this booking</button>}
      <a href="/book" className="ml-3 inline-flex items-center rounded-full bg-[#002b6c] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white">Book a new time</a>
    </div>
  )
}
