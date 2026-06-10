import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import logo from './assets/images/visamax_logo.jpeg'
import adeyemiImg from './assets/images/adeyemi.jpeg'
import victoriaImg from './assets/images/victoria.jpeg'
import christyImg from './assets/images/christy.jpeg'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Team', to: '/team' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
]

const services = [
  'Visa Services',
  'Flight Booking',
  'Hotel Booking',
  'Tourism',
  'Overseas Studies',
  'Family Visas',
  'Business Travel',
  'Expert Support',
]

const consultationTypes = [
  'Visa Services',
  'Flight Booking',
  'Hotel Booking (Home & Abroad)',
  'Tourism Package',
  'Overseas Studies',
  'Family Visas',
  'Business Travel',
  'General Travel Consultation',
]

const slotOptions = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
]

interface TeamMember {
  name: string
  role: string
  phone?: string
  bio: string
  initials: string
  color: string
  image?: string
}

const team: TeamMember[] = [
  {
    name: 'Ademola Adenusi',
    role: 'Chief Executive Officer',
    phone: '+234 817 002 0431',
    bio: "Visionary leader driving Kurios Sat's mission to empower businesses and individuals through innovative technology solutions and strategic digital transformation.",
    initials: 'AA',
    color: '#0F1E38',
  },
  {
    name: 'Adeyemi Adenusi',
    role: 'Head of Human Resources',
    phone: '+234 811 592 4866',
    bio: 'As the Head of Human Resources at Visa Max, Mrs. Adeyemi Adenusi provides strategic leadership in talent acquisition, employee development, and organizational culture. With a focus on efficiency, professionalism, and staff empowerment, she ensures the organization attracts and retains top talent.',
    initials: 'AA',
    color: '#6DB32F',
    image: adeyemiImg,
  },
  {
    name: 'Victoria Omodogbe',
    role: 'Head of Administration',
    phone: '+234 809 667 3814',
    bio: 'Supports the CEO in strategic planning, oversees administrative operations, and ensures smooth coordination across departments to drive organisational success.',
    initials: 'VO',
    color: '#2E6A0A',
    image: victoriaImg,
  },
  {
    name: 'Noah Christiana',
    role: 'Head of Department',
    phone: '+234 903 679 9843',
    bio: 'Christianaserves as the Head of Department at Visa Max, overseeing departmental operations, team coordination, and service efficiency. Known for professionalism and strong leadership, she is committed to delivering excellent organizational support and client satisfaction',
    initials: 'FI',
    color: '#1a2f52',
    image: christyImg,
  },
]

type ReviewRecord = {
  id: string
  name: string
  service: string
  text: string
  rating: number
  status?: 'pending' | 'approved' | 'rejected'
  source?: string
  phone?: string
  createdAt?: string
}

const seedReviews: ReviewRecord[] = [
  {
    id: 'seed-1',
    name: 'Chioma E.',
    service: 'Visa Processing',
    text: 'VisaMax guided me through my visa application with clear instructions and quick feedback. The process was smooth and stress-free.',
    rating: 5,
  },
  {
    id: 'seed-2',
    name: 'Tunde A.',
    service: 'Flight & Hotel Booking',
    text: 'Great support from consultation to booking. They helped me secure a good flight option and hotel that matched my budget.',
    rating: 5,
  },
  {
    id: 'seed-3',
    name: 'Grace O.',
    service: 'Overseas Study Travel',
    text: 'Professional team and reliable communication. They helped me prepare travel documentation and made everything easier to understand.',
    rating: 5,
  },
  {
    id: 'seed-4',
    name: 'Ibrahim M.',
    service: 'Family Visa Support',
    text: 'Very responsive and detail-oriented. We got the right guidance on required documents and timelines from day one.',
    rating: 5,
  },
]

type ChatRole = 'assistant' | 'user'

type ChatMessage = {
  id: number
  role: ChatRole
  text: string
}

const chatQuickPrompts = [
  'Visa requirements',
  'Documents required',
  'Flight booking requirement',
  'Flight booking help',
  'Hotel booking',
  'Office consultation',
]

const openingBotMessage =
  'Hello! I am the VisaMax AI assistant. I can help with visa, flight, hotel, tourism, and office consultation questions. Office working days are Monday to Friday (9am-5pm).'

const documentRequirementsMessage =
  'DOCUMENT REQUIRED\n' +
  '- Data page of international passport\n' +
  '- Birth certificate\n' +
  '- CAC/TIN\n' +
  '- Employment letter\n' +
  '- Marriage certificate\n' +
  '- Statement of Account\n' +
  '- Curriculum Vitae\n' +
  '- Academic credentials\n\n' +
  'More documents could be required on individual basis.\n' +
  'Speak with us if you do not have all the requirements.'

const flightBookingRequirementsMessage =
  'FLIGHT BOOKING REQUIREMENT\n' +
  '- Data page of international passport\n' +
  '- Travel itinerary'

const officeWorkingDaysMessage =
  'Our office working days are Monday - Friday (9am-5pm).\n' +
  'For faster support, you can also reach us on WhatsApp: +234 806 088 6447.'

function getBotReply(input: string) {
  const text = input.toLowerCase()

  if (
    text.includes('flight booking requirement') ||
    text.includes('flight requirement') ||
    text.includes('flight booking reuirement') ||
    text.includes('reuirement')
  ) {
    return `${flightBookingRequirementsMessage}\n\nIf you need help, chat with us on WhatsApp: +234 806 088 6447.`
  }

  if (text.includes('document') || text.includes('requirement') || text.includes('required')) {
    return `${documentRequirementsMessage}\n\nFor faster support, chat with us on WhatsApp: +234 806 088 6447.`
  }

  if (text.includes('visa')) {
    return 'We support multiple visa categories and application guidance. Share your destination and travel date, and our consultants can guide your required documents.'
  }

  if (text.includes('flight') || text.includes('ticket')) {
    return 'We can help you compare flight options and secure bookings for local and international trips. Tell me your route and preferred travel date.'
  }

  if (text.includes('hotel') || text.includes('accommodation')) {
    return 'VisaMax assists with hotel reservations both within Nigeria and internationally. Share your destination and budget range for suggestions.'
  }

  if (text.includes('book') || text.includes('consult') || text.includes('appointment')) {
    return 'You can book an office consultation with our consultants on the booking page. Choose a service, date, and time slot, and we will confirm your visit.'
  }

  if (text.includes('address') || text.includes('location') || text.includes('office')) {
    return 'Our office is at 51, Ayangburen Road, Opposite Ayangburen Palace, Top Floor, Same building as KFC and Samsung office, Ikorodu, Lagos.'
  }

  if (text.includes('phone') || text.includes('call') || text.includes('whatsapp') || text.includes('contact')) {
    return 'You can reach VisaMax on +234 817 002 0431 or +234 806 088 6447. Email: info@visamaxtravels.com.'
  }

  if (text.includes('hour') || text.includes('open') || text.includes('time')) {
    return officeWorkingDaysMessage
  }

  return 'I can help with visa services, flights, hotel bookings, tourism packages, overseas studies, and office consultation bookings. What would you like to do?'
}

function AiChatWidget() {
  const navigate = useNavigate()
  const timerRef = useRef<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'assistant', text: openingBotMessage },
  ])

  const openWhatsApp = (seedText?: string) => {
    const message = seedText?.trim()
      ? `Hello VisaMax Travel, I need help with: ${seedText.trim()}`
      : 'Hello VisaMax Travel, I need help with visa requirements and document guidance.'
    const whatsappUrl = `https://wa.me/2348060886447?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  const sendMessage = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      return
    }

    setMessages((current) => [...current, { id: Date.now(), role: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: 'assistant', text: getBotReply(trimmed) },
      ])
      setIsTyping(false)
    }, 500)
  }

  return (
    <div className="fixed bottom-3 right-3 z-[70] sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="flex h-[min(88vh,640px)] w-[min(94vw,380px)] flex-col overflow-hidden rounded-2xl border border-[#002b6c]/10 bg-white shadow-[0_24px_60px_rgba(0,43,108,0.32)] animate-[fadeInUp_0.2s_ease-out]">
          {/* Header */}
          <div className="sticky top-0 z-10 shrink-0 bg-[linear-gradient(135deg,#001a45_0%,#002b6c_55%,#c8102e_130%)] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black tracking-[-0.01em] leading-none">VisaMax AI Assistant</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]"></span>
                  Online 24/7
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f4f7fc] px-3 py-3 scroll-smooth">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.82rem] leading-6 ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-[#002b6c] text-white'
                      : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 whitespace-pre-line'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]"></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="shrink-0 border-t border-slate-100 bg-white px-3 pt-2.5 pb-0">
            <div className="flex flex-wrap gap-1.5 pb-2.5">
              {chatQuickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-slate-200 bg-[#f4f7fc] px-2.5 py-1 text-[0.67rem] font-semibold text-slate-600 transition hover:border-[#002b6c] hover:bg-[#002b6c]/5 hover:text-[#002b6c]"
                >
                  {prompt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => navigate('/book')}
                className="rounded-full bg-[#c8102e]/10 px-2.5 py-1 text-[0.67rem] font-semibold text-[#c8102e] transition hover:bg-[#c8102e] hover:text-white"
              >
                Book Consultation
              </button>
              <button
                type="button"
                onClick={() => openWhatsApp(input)}
                className="rounded-full bg-[#22c55e]/15 px-2.5 py-1 text-[0.67rem] font-semibold text-[#15803d] transition hover:bg-[#22c55e] hover:text-white"
              >
                WhatsApp Us
              </button>
            </div>

            {/* Input */}
            <form
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage(input)
              }}
              className="flex items-center gap-2 border-t border-slate-100 py-2.5"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="flex-1 rounded-full border border-slate-200 bg-[#f4f7fc] px-4 py-2 text-[0.82rem] outline-none transition focus:border-[#002b6c] focus:bg-white"
                placeholder="Ask about visa, flights, hotelsâ€¦"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#002b6c] text-white transition hover:bg-[#001a45] active:scale-95"
              >
                <svg className="h-4 w-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Floating Action Button */
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-[#002b6c] animate-ping opacity-25" />
          <span className="absolute inset-0 rounded-full bg-[#002b6c] animate-ping opacity-15 [animation-delay:0.6s]" />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI chat support"
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(145deg,#001a45_0%,#002b6c_55%,#1a56c8_100%)] text-white shadow-[0_8px_32px_rgba(0,43,108,0.5)] transition hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,43,108,0.6)] active:scale-95"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/>
            </svg>
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#22c55e]">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white opacity-80" />
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#001a45]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <img src={logo} alt="VisaMax Travel Ltd" className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-[#c8102e]/20 ring-2 ring-white/20" />
            <div className="leading-none">
              <div className="text-lg font-black tracking-[-0.03em] text-white">VisaMax</div>
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/65">Travel Ltd</div>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold text-white transition ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/book"
              className="ml-2 inline-flex items-center rounded-full bg-[#c8102e] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#a30d26]"
            >
              Book Now
            </NavLink>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg text-white transition hover:bg-white/10 md:hidden"
          >
            <span className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#001a45] px-5 pb-5 pt-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/book"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#c8102e] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#a30d26]"
              >
                Book Now
              </NavLink>
            </nav>
          </div>
        )}
      </header>
      {children}
      <footer className="bg-[#001a45] text-white">
        <div className="border-t border-white/10 py-14">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:px-12">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <img src={logo} alt="VisaMax Travel Ltd" className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-[#c8102e]/20 ring-2 ring-white/20" />
                <div className="leading-none">
                  <div className="text-lg font-black tracking-[-0.03em]">VisaMax</div>
                  <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/45">Travel Ltd</div>
                </div>
              </div>
              <p className="max-w-sm text-sm leading-7 text-white/55">
                Your trusted travel partner for visa processing, flights, hotels, tourism and more.
              </p>
            </div>

            <div>
              <h4 className="mb-4 inline-block border-b-2 border-[#c8102e] pb-2 text-xs font-bold uppercase tracking-[0.14em] text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm text-white/90">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className="transition hover:text-white">
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 inline-block border-b-2 border-[#c8102e] pb-2 text-xs font-bold uppercase tracking-[0.14em] text-white">Our Services</h4>
              <ul className="space-y-3 text-sm text-white/90">
                {services.map((service) => (
                  <li key={service}>
                    <NavLink to="/services" className="transition hover:text-white">
                      {service}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 inline-block border-b-2 border-[#c8102e] pb-2 text-xs font-bold uppercase tracking-[0.14em] text-white">Contact Info</h4>
              <div className="space-y-4 text-sm leading-7 text-white/55">
                <p className="flex flex-col gap-1">
                  <strong className="text-xs font-bold uppercase tracking-[0.08em] text-white">Call / WhatsApp</strong>
                  <a href="tel:+2348170020431" className="transition hover:text-white">+234 817 002 0431</a>
                  <a href="tel:+2348060886447" className="transition hover:text-white">+234 806 088 6447</a>
                </p>
                <p className="flex flex-col gap-1">
                  <strong className="text-xs font-bold uppercase tracking-[0.08em] text-white">Email</strong>
                  <a href="mailto:info@visamaxtravels.com" className="transition hover:text-white">info@visamaxtravels.com</a>
                </p>
                <p className="flex flex-col gap-1">
                  <strong className="text-xs font-bold uppercase tracking-[0.08em] text-white">Address</strong>
                  <span>51, Ayangburen Road, Opposite Ayangburen Palace, Top Floor, Same building as KFC and Samsung office, Ikorodu, Lagos.</span>
                </p>
                <p className="flex flex-col gap-1">
                  <strong className="text-xs font-bold uppercase tracking-[0.08em] text-white">Social</strong>
                  <span className="flex items-center gap-2">
                    <a
                      href="https://www.instagram.com/visamax_travels/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                    <a
                      href="https://www.tiktok.com/@visa.max0"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="TikTok"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M16 3c.6 3.4 2.7 5.4 5.9 5.8v3.1c-2.1.1-4-.5-5.9-1.7V16c0 3.1-2.5 5.5-5.6 5.5S4.8 19.1 4.8 16c0-3.1 2.5-5.6 5.6-5.6.3 0 .6 0 .9.1v3.4c-.3-.1-.6-.2-.9-.2-1.2 0-2.2.9-2.2 2.2 0 1.2 1 2.1 2.2 2.1s2.2-.9 2.2-2.1V3H16z" />
                      </svg>
                    </a>
                    <span className="text-white/55">@visamax_travels | @visa.max0</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 text-xs text-white/35 sm:px-8 lg:px-12">
            <p>Â© {new Date().getFullYear()} VisaMax Travel Ltd. All rights reserved.</p>
            <p>/ visamaxtravel</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomePage() {
  return (
    <PageShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(145deg,#001a45_0%,#002b6c_58%,#c8102e_140%)] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(21,101,192,0.28)_0%,transparent_42%),radial-gradient(circle_at_85%_15%,rgba(200,16,46,0.2)_0%,transparent_35%),radial-gradient(circle_at_70%_85%,rgba(21,101,192,0.18)_0%,transparent_40%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-28">
            <div>
              <span className="mb-6 inline-flex border border-[#c8102e]/25 bg-[#c8102e]/10 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#ff98a9]">
                Nigeria&apos;s Trusted Travel Partner
              </span>
              <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Your Journey, <span className="block text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.5)] sm:inline">Our Expertise.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                Visa processing, flight bookings, hotel reservations for local and international trips, tourism packages, overseas education and more - handled end-to-end with professionalism and care.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <NavLink to="/book" className="inline-flex items-center gap-2 rounded-full bg-[#c8102e] px-7 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#a30d26]">
                  Book a Consultation
                </NavLink>
                <NavLink to="/services" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-7 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10">
                  Our Services
                </NavLink>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 overflow-hidden border border-white/10 bg-white/5 shadow-[0_16px_48px_rgba(0,0,0,0.18)]">
                {[
                  ['1,000+', 'Visas Processed'],
                  ['50+', 'Countries Covered'],
                  ['500+', 'Happy Clients'],
                ].map(([n, label]) => (
                  <div key={label} className="border-b border-r border-white/10 p-6">
                    <div className="text-3xl font-black leading-none text-white">{n}</div>
                    <div className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/50">{label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-5 border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white/70 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#c8102e]" />
                  <span>+234 817 002 0431</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#c8102e]" />
                  <span>Ikorodu, Lagos</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 overflow-hidden bg-[#c8102e] py-3">
            <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8 whitespace-nowrap px-6 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white">
              {services.concat(services).map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-8">
                  <span>{item}</span>
                  <span className="text-white/60">âœ¦</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#c8102e]">About VisaMax</span>
                <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.03em] text-[#002b6c] sm:text-4xl">
                  Built to make travel planning easier, faster, and more reliable.
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                  VisaMax Travel Ltd is based in Ikorodu, Lagos, and supports clients with visa applications, flight and hotel reservations, tourism, overseas study travel, family visas, and business trips. We combine hands-on guidance with practical experience so clients can avoid delays and travel with confidence.
                </p>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                  From first consultation to final travel readiness, our consultants focus on clear communication, accurate documentation, and dependable support at every step.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    'Licensed and accredited travel support',
                    'Transparent, client-friendly process',
                    'Dedicated support for students, families, and business travelers',
                    'Fast response with attention to detail',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#c8102e]" />
                      <p className="text-sm leading-6 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <NavLink
                    to="/about"
                    className="inline-flex items-center rounded-full bg-[#002b6c] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.1em] !text-white transition hover:bg-[#001a45]"
                  >
                    Read Full About Page
                  </NavLink>
                </div>
              </div>

              <div className="grid gap-4">
                <article className="border border-slate-200 bg-[#f4f7fc] p-6 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#c8102e]">Our Mission</p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.02em] text-[#002b6c]">To make global travel simple and dependable.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    We deliver reliable travel support that helps clients meet timelines, avoid costly mistakes, and stay confident throughout the process.
                  </p>
                </article>

                <article className="border border-slate-200 bg-[#f4f7fc] p-6 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#c8102e]">Our Vision</p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.02em] text-[#002b6c]">To be Nigeria&apos;s most trusted travel support brand.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    We lead with service quality, clear communication, and consistent outcomes for tourism, education, family, and business travel.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <ServicesSection />

        <ReviewsSection />

        <ContactSection />
      </main>
    </PageShell>
  )
}

function AboutPage() {
  const values = [
    {
      title: 'Integrity First',
      text: 'We give clear guidance, honest timelines, and transparent requirements so clients can make informed travel decisions.',
    },
    {
      title: 'Detail & Accuracy',
      text: 'From visa documentation to travel itineraries, we pay close attention to every detail that affects approvals and comfort.',
    },
    {
      title: 'Client-Centered Service',
      text: 'Every traveler has unique goals. We tailor support for students, families, tourists, and business professionals.',
    },
    {
      title: 'Speed With Care',
      text: 'We move fast on urgent requests while keeping quality checks in place to reduce mistakes and avoid delays.',
    },
  ]

  const process = [
    {
      step: '01',
      title: 'Consultation & Assessment',
      text: 'We understand your destination, purpose, budget, and timeline, then map out the best route for your request.',
    },
    {
      step: '02',
      title: 'Documentation & Booking',
      text: 'Our team supports visa documentation, flight and hotel options, and every required form or submission step.',
    },
    {
      step: '03',
      title: 'Pre-Travel Readiness',
      text: 'Before departure, we confirm essentials such as checklist completion, schedule alignment, and travel readiness.',
    },
    {
      step: '04',
      title: 'Ongoing Support',
      text: 'Clients can still reach us for updates, adjustments, and guidance after booking or submission.',
    },
  ]

  return (
    <PageShell>
      <main className="bg-white">
        <section className="bg-[linear-gradient(145deg,#001a45_0%,#002b6c_58%,#c8102e_140%)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff98a9]">About Us</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">A trusted travel partner built for confidence, clarity, and results.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/72">
              VisaMax Travel Ltd helps individuals, families, students, and businesses move from planning to departure with confidence. We combine local expertise in Nigeria with international travel support to deliver a smooth, professional experience from start to finish.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
            <img src={logo} alt="VisaMax Travel Ltd logo" className="rounded-3xl border border-slate-200 p-4 shadow-[0_20px_50px_rgba(0,43,108,0.12)]" />
            <div>
              <h2 className="text-3xl font-black tracking-[-0.03em] text-[#002b6c]">What We Stand For</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Based in Ikorodu, Lagos, VisaMax Travel Ltd was founded to make international and domestic travel easier, safer, and more accessible for Nigerians. We understand that every application, booking, and travel decision can be time-sensitive, which is why our team focuses on clarity, responsiveness, and proper guidance at every stage.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Over the years, we have supported clients with visa processing, flight bookings, hotel reservations, tourism packages, overseas study travel, family visas, and business trips. Our goal is simple: reduce stress, save time, and help you travel with confidence.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Licensed & accredited travel support',
                  'Visa, flight, and hotel booking expertise',
                  'Local and international travel assistance',
                  'Dedicated support for students, families, and business travelers',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 rounded-full bg-[#c8102e]" />
                    <p className="text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f8fafc] py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
            <article className="border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#c8102e]">Our Mission</p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.02em] text-[#002b6c]">To make global travel simple and dependable.</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">
                We are committed to delivering reliable travel and visa support that helps clients avoid costly mistakes, meet deadlines, and travel with peace of mind.
              </p>
            </article>
            <article className="border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#c8102e]">Our Vision</p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.02em] text-[#002b6c]">To be Nigeria&apos;s most trusted travel support brand.</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">
                We aim to lead with service quality, transparent communication, and consistent outcomes for clients traveling for tourism, education, family, and business.
              </p>
            </article>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#c8102e]">Our Core Values</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#002b6c] sm:text-4xl">How we serve every client</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {values.map((value) => (
                <article key={value.title} className="border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-black text-[#002b6c]">{value.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#001a45] py-24 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff98a9]">Our Process</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">A clear path from request to travel</h2>
              <p className="mt-4 text-base leading-8 text-white/75">
                Our workflow is structured to keep you informed, prepared, and supported from your first conversation to your final travel arrangements.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {process.map((item) => (
                <article key={item.step} className="border border-white/15 bg-white/5 p-6 backdrop-blur">
                  <p className="text-xs font-black tracking-[0.2em] text-[#ff98a9]">STEP {item.step}</p>
                  <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/75">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  )
}

function ServicesPage() {
  return (
    <PageShell>
      <main>
        <section className="bg-[linear-gradient(145deg,#001a45_0%,#002b6c_58%,#c8102e_140%)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff98a9]">Services</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Everything you need for travel, visas and bookings.</h1>
          </div>
        </section>

        <ServicesSection />
      </main>
    </PageShell>
  )
}

function TeamPage() {
  return (
    <PageShell>
      <main>
        <section className="bg-[linear-gradient(145deg,#001a45_0%,#002b6c_58%,#c8102e_140%)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff98a9]">Our Team</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Meet the leadership team behind our operations.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">
              Connect with our core team for strategic guidance, service quality, and dependable client support.
            </p>
          </div>
        </section>

        <section className="bg-[#f4f7fc] py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-6 md:grid-cols-2">
              {team.map((member) => (
                <article key={member.name} className="border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div
                      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full"
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center text-lg font-black text-white"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.initials}
                      </div>
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : null}
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-[-0.02em] text-[#002b6c]">{member.name}</h2>
                      <p className="mt-1 text-sm font-bold uppercase tracking-[0.1em] text-[#c8102e]">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-600">{member.bio}</p>
                  {member.phone ? (
                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      Phone:{' '}
                      <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="text-[#002b6c] transition hover:text-[#001a45]">
                        {member.phone}
                      </a>
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  )
}

function ReviewsPage() {
  return (
    <PageShell>
      <main>
        <section className="bg-[linear-gradient(145deg,#001a45_0%,#002b6c_58%,#c8102e_140%)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff98a9]">Client Reviews</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">What our clients say about VisaMax Travel Ltd.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">
              Trusted by travelers, students, families, and business clients for dependable support and clear guidance.
            </p>
          </div>
        </section>

        <ReviewsSection />
      </main>
    </PageShell>
  )
}

function AdminReviewsPage() {
  const [adminKey, setAdminKey] = useState('')
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadAdminReviews = async () => {
    if (!adminKey.trim()) {
      setError('Enter your admin key to load reviews.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/reviews?status=${statusFilter}`, {
        headers: {
          'x-admin-key': adminKey.trim(),
        },
      })

      if (!response.ok) {
        throw new Error('Could not load admin reviews. Check your admin key.')
      }

      const data = (await response.json()) as ReviewRecord[]
      setReviews(data)
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to load reviews.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const updateReviewStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.trim(),
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update review status.')
      }

      setReviews((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : 'Failed to update review.'
      setError(message)
    }
  }

  return (
    <PageShell>
      <main>
        <section className="bg-[linear-gradient(145deg,#001a45_0%,#002b6c_58%,#c8102e_140%)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff98a9]">Admin</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Review Approval Panel</h1>
          </div>
        </section>

        <section className="bg-[#f4f7fc] py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Enter admin key"
                className="border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#002b6c]"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as 'pending' | 'approved' | 'rejected' | 'all')}
                className="border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#002b6c]"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="all">All</option>
              </select>
              <button
                type="button"
                onClick={loadAdminReviews}
                className="rounded bg-[#002b6c] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white"
              >
                {loading ? 'Loading...' : 'Load'}
              </button>
            </div>

            {error && <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-[#c8102e]">{error}</p>}

            <div className="grid gap-4">
              {reviews.map((review) => (
                <article key={review.id} className="border border-slate-200 bg-white p-5">
                  <p className="text-sm font-black text-[#002b6c]">{review.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#c8102e]">{review.service}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{review.text}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Status: {review.status || 'pending'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateReviewStatus(review.id, 'approved')} className="rounded bg-[#16a34a] px-3 py-2 text-xs font-bold uppercase text-white">Approve</button>
                    <button type="button" onClick={() => updateReviewStatus(review.id, 'rejected')} className="rounded bg-[#c8102e] px-3 py-2 text-xs font-bold uppercase text-white">Reject</button>
                    <button type="button" onClick={() => updateReviewStatus(review.id, 'pending')} className="rounded bg-slate-700 px-3 py-2 text-xs font-bold uppercase text-white">Set Pending</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  )
}

function ServicesSection() {
  return (
    <section className="bg-[#f4f7fc] py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-10 max-w-3xl">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#c8102e]">What We Offer</span>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#002b6c] sm:text-4xl">Comprehensive Travel Solutions</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            From your first visa application to your return flight home, we handle every detail with expertise and care.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article key={service} className="bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,43,108,0.12)]">
              <div className="mb-4 h-10 w-10 text-[#002b6c]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <h3 className="mb-2 text-[0.96rem] font-bold text-[#002b6c]">{service}</h3>
              <p className="text-sm leading-6 text-slate-600">
                Tailored support for clients looking for reliable, professional and fast-moving travel assistance.
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 border border-[#002b6c]/10 bg-white p-7 shadow-sm sm:p-9">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#c8102e]">Job Opportunities Abroad</span>
          <h2 className="mt-3 max-w-4xl text-2xl font-black tracking-[-0.02em] text-[#002b6c] sm:text-3xl">
            We can help you explore job opportunities in Canada, USA, Europe, Australia, New Zealand, Qatar, Kuwait, and more.
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
            For job opportunities abroad, please reach out to us for consultation and eligibility guidance. Terms and conditions apply.
          </p>
          <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600">
            To immigrate to Canada, Australia, or New Zealand, contact VisaMax Travel Ltd for the right pathway and documentation support.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NavLink
              to="/contact"
              className="inline-flex items-center rounded-full bg-[#c8102e] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] !text-white transition hover:bg-[#a30d26]"
            >
              Reach Out Now
            </NavLink>
            <NavLink
              to="/book"
              className="inline-flex items-center rounded-full border border-[#002b6c]/20 bg-white px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-[#002b6c] transition hover:bg-[#002b6c] hover:text-white"
            >
              Book Consultation
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewRecord[]>(seedReviews)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch('/api/reviews')
        if (!response.ok) {
          return
        }

        const data = (await response.json()) as ReviewRecord[]
        if (data.length > 0) {
          setReviews(data)
        }
      } catch {
        // Keep fallback seed reviews if API is unavailable.
      }
    }

    void loadReviews()
  }, [])

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-10 max-w-3xl">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#c8102e]">Reviews</span>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#002b6c] sm:text-4xl">Real feedback from our clients</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            We are committed to quality service and consistent results. Here is what clients say about working with VisaMax Travel Ltd.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-1 text-[#f59e0b]" aria-label={`${review.rating} star rating`}>
                {Array.from({ length: review.rating }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <p className="text-sm leading-7 text-slate-700">"{review.text}"</p>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-sm font-black text-[#002b6c]">{review.name}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#c8102e]">{review.service}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://wa.me/2348060886447?text=Hello%20VisaMax%20Travel%2C%20I%20want%20to%20share%20my%20review."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-[#22c55e] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] !text-white transition hover:bg-[#16a34a]"
          >
            Share Review on WhatsApp
          </a>
          <NavLink
            to="/contact"
            className="inline-flex items-center rounded-full border border-[#002b6c]/20 bg-white px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-[#002b6c] transition hover:bg-[#002b6c] hover:text-white"
          >
            Contact Us
          </NavLink>
        </div>
      </div>
    </section>
  )
}

// â”€â”€ Contact page with Formspree email delivery â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Sign up at formspree.io â†’ create form â†’ paste your Form ID below
const CONTACT_FORMSPREE = "https://formspree.io/f/YOUR_FORM_ID";
const contactServiceOptions = [
  "Visa Services","Flight Booking","Hotel Booking",
  "Tourism Package","Overseas Studies","Family Visa",
  "Business Travel","Expert Support","Other",
];

function ContactSection() {
  const [cForm, setCForm] = useState({ name: "", email: "", phone: "", service: "", message: "" })
  const [cSent, setCsent] = useState(false)
  const [cError, setCerror] = useState("")
  const [cLoading, setCloading] = useState(false)

  const openContactWhatsApp = () => {
    const detailParts = [
      cForm.name ? `Name: ${cForm.name}` : '',
      cForm.email ? `Email: ${cForm.email}` : '',
      cForm.phone ? `Phone: ${cForm.phone}` : '',
      cForm.service ? `Service: ${cForm.service}` : '',
      cForm.message ? `Message: ${cForm.message}` : '',
    ].filter(Boolean)

    const message = detailParts.length
      ? `Hello VisaMax Travel, I want to make an enquiry.\n${detailParts.join('\n')}`
      : 'Hello VisaMax Travel, I need help with visa and travel consultation.'

    const whatsappUrl = `https://wa.me/2348060886447?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const cSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCloading(true)
    setCerror("")
    try {
      const res = await fetch(CONTACT_FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(cForm),
      })
      if (res.ok) {
        setCsent(true)
      } else {
        setCerror("Failed to send. Please call +234 817 002 0431.")
      }
    } catch {
      setCerror("Network error. Please call +234 817 002 0431.")
    } finally {
      setCloading(false)
    }
  }

  return (
    <section className="bg-[#f4f7fc] py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:px-12">
        <div>
          <img src={logo} alt="VisaMax Travel Ltd logo" className="mb-8 w-full max-w-xl rounded-3xl border border-slate-200 p-4 shadow-[0_20px_50px_rgba(0,43,108,0.12)]" />
          <div className="space-y-5 text-slate-700">
            <p><strong className="text-[#002b6c]">Phone:</strong> +234 817 002 0431, +234 806 088 6447</p>
            <p><strong className="text-[#002b6c]">Email:</strong> info@visamaxtravels.com</p>
            <p><strong className="text-[#002b6c]">Working Days:</strong> Monday - Friday (9am-5pm)</p>
            <p><strong className="text-[#002b6c]">Address:</strong> 51, Ayangburen Road, Opposite Ayangburen Palace, Top Floor, Same building as KFC and Samsung office, Ikorodu, Lagos.</p>
            <button
              type="button"
              onClick={openContactWhatsApp}
              className="inline-flex items-center rounded-full bg-[#22c55e] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#16a34a]"
            >
              WhatsApp Automation
            </button>
          </div>
        </div>
        <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,43,108,0.12)] sm:p-10">
          {cSent ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#002b6c] text-2xl text-white">&#10003;</div>
              <h3 className="text-2xl font-black text-[#002b6c]">Message Sent!</h3>
              <p className="mt-2 text-slate-600">A VisaMax consultant will contact you within 24 hours.</p>
              <button onClick={() => { setCsent(false); setCForm({ name: "", email: "", phone: "", service: "", message: "" }) }} className="mt-6 rounded-full bg-[#c8102e] px-6 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#a30d26]">Send Another</button>
            </div>
          ) : (
            <form onSubmit={cSubmit} className="space-y-4">
              <h2 className="mb-6 border-b-2 border-[#c8102e] pb-3 text-2xl font-black text-[#002b6c]">Send Us a Message</h2>
              {cError && <p className="rounded border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-[#c8102e]">{cError}</p>}
              <div className="grid gap-4 md:grid-cols-2">
                <input required value={cForm.name} onChange={e => setCForm({ ...cForm, name: e.target.value })} className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]" placeholder="Full Name *" />
                <input required type="email" value={cForm.email} onChange={e => setCForm({ ...cForm, email: e.target.value })} className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]" placeholder="Email Address *" />
                <input type="tel" value={cForm.phone} onChange={e => setCForm({ ...cForm, phone: e.target.value })} className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]" placeholder="Phone Number" />
                <select value={cForm.service} onChange={e => setCForm({ ...cForm, service: e.target.value })} className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]">
                  <option value="">Select a service...</option>
                  {contactServiceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <textarea required value={cForm.message} onChange={e => setCForm({ ...cForm, message: e.target.value })} className="min-h-40 w-full border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]" placeholder="Tell us about your travel plans... *" />
              <button disabled={cLoading} className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#c8102e] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#a30d26] disabled:opacity-60">
                {cLoading ? "Sending\u2026" : "Send Message \u2192"}
              </button>
              <button
                type="button"
                onClick={openContactWhatsApp}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#22c55e] px-5 py-3.5 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#16a34a]"
              >
                Continue on WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function ContactPage() {
  return (
    <PageShell>
      <main>
        <section className="bg-[linear-gradient(145deg,#001a45_0%,#002b6c_58%,#c8102e_140%)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff98a9]">Contact</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Talk to VisaMax Travel Ltd today.</h1>
          </div>
        </section>
        <ContactSection />
      </main>
    </PageShell>
  )
}

function BookingPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: consultationTypes[0],
    date: '',
    time: slotOptions[0],
    notes: '',
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageShell>
      <main>
        <section className="bg-[linear-gradient(145deg,#001a45_0%,#002b6c_58%,#c8102e_140%)] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff98a9]">Appointment Booking</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Book your office consultation with VisaMax.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
              Pick your service, preferred date and time slot for an in-office meeting with our consultants. Our team will confirm your appointment via phone or email.
            </p>
          </div>
        </section>

        <section className="bg-[#f4f7fc] py-24">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:px-12">
            <div>
              <img src={logo} alt="VisaMax Travel Ltd logo" className="mb-8 w-full max-w-xl rounded-3xl border border-slate-200 p-4 shadow-[0_20px_50px_rgba(0,43,108,0.12)]" />
              <div className="space-y-4 text-slate-700">
                <h2 className="text-2xl font-black tracking-[-0.02em] text-[#002b6c]">What Happens Next?</h2>
                <p className="leading-7">1. Submit your preferred office consultation details.</p>
                <p className="leading-7">2. We review availability and contact you to confirm.</p>
                <p className="leading-7">3. Visit our office to meet our consultants and receive guidance on the next required documents.</p>
                <p className="pt-2 text-sm text-slate-600">For urgent requests, call +234 817 002 0431.</p>
              </div>
            </div>

            <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,43,108,0.12)] sm:p-10">
              {submitted ? (
                <div className="rounded-2xl border border-[#c8102e]/20 bg-[#fff5f7] p-6 text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#c8102e]">Appointment Request Sent</p>
                  <h2 className="mt-2 text-2xl font-black text-[#002b6c]">Thank you, {form.fullName || 'Client'}.</h2>
                  <p className="mt-3 text-slate-700">
                    Your request for <strong>{form.service}</strong> on <strong>{form.date || 'your selected date'}</strong> at <strong>{form.time}</strong> has been received.
                  </p>
                  <p className="mt-2 text-sm text-slate-600">A VisaMax representative will contact you shortly to confirm your office appointment.</p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-5 inline-flex items-center rounded-full bg-[#002b6c] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#001a45]"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <h2 className="mb-2 border-b-2 border-[#c8102e] pb-3 text-2xl font-black text-[#002b6c]">Consultation Details</h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]"
                      placeholder="Full Name"
                    />
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]"
                      placeholder="Phone Number"
                    />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]"
                      placeholder="Email Address"
                    />
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]"
                    >
                      {consultationTypes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]"
                    />
                    <select
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]"
                    >
                      {slotOptions.map((slot) => (
                        <option key={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="min-h-32 w-full border border-slate-200 bg-[#f4f7fc] px-4 py-3 outline-none focus:border-[#002b6c]"
                    placeholder="Tell us your travel plan, destination, and any deadlines for your office consultation..."
                  />

                  <button className="inline-flex w-full items-center justify-center rounded-full bg-[#c8102e] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#a30d26]">
                    Confirm Appointment Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<BookingPage />} />
      </Routes>
      <AiChatWidget />
    </BrowserRouter>
  )
}

export default App
