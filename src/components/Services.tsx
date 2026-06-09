import "./Services.css";

const SERVICES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M6 8h2m2 0h2m2 0h2M6 11h2m2 0h2m2 0h2"/></svg>,
    title: "Visa Services",
    desc: "Tourist, student, work, and transit visa applications handled expertly for major embassies worldwide.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2l-1.1 1.1 4.7 4.7L4 12l-2 1 2.7 2.7 2.7 2.7 1-2 1.7-2.4 4.7 4.7 1.3-1.8z"/></svg>,
    title: "Flight Booking",
    desc: "Competitive airfares on domestic and international routes with multiple airline options.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    title: "Hotel Booking",
    desc: "Verified accommodations home and abroad � budget-friendly to luxury, we find the right fit.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    title: "Tourism",
    desc: "Curated travel packages and guided tours to top destinations across Africa, Europe, Asia and the Americas.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    title: "Overseas Studies",
    desc: "End-to-end student travel support � university applications, student visas, accommodation and enrollment.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: "Family Visas",
    desc: "Spousal, dependent, and family reunion visa applications handled sensitively and efficiently.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    title: "Business Travel",
    desc: "Corporate travel management, business visa processing, and premium travel arrangements for professionals.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    title: "Expert Support",
    desc: "24/7 travel advisory, document checks, interview coaching and dedicated support from start to finish.",
  },
];

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services__header">
          <span className="section-label">What We Offer</span>
          <h2 className="section-title">Comprehensive Travel Solutions</h2>
          <p className="section-desc">
            From your first visa application to your return flight home, we handle every detail with expertise and care.
          </p>
        </div>
        <div className="services__grid">
          {SERVICES.map((s) => (
            <div key={s.title} className="svc-card">
              <div className="svc-card__icon">{s.icon}</div>
              <h3 className="svc-card__title">{s.title}</h3>
              <p className="svc-card__desc">{s.desc}</p>
                <p className="svc-card__price">Pricing varies &mdash; contact us directly</p>
                <a href="/contact" className="svc-card__link">Contact Us for Pricing <span aria-hidden>&rarr;</span></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
