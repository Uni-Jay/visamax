import "./Footer.css";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Why Choose Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  "Visa Services","Flight Booking","Hotel Booking","Tourism",
  "Overseas Studies","Family Visas","Business Travel","Expert Support",
];

const SOCIALS = [
  { href: "https://facebook.com/visamaxtravel", label: "Facebook", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { href: "https://instagram.com/visama_travels", label: "Instagram", isStroke: true },
  { href: "https://www.tiktok.com/@visa.max0", label: "TikTok", d: "M16 3c.6 3.4 2.7 5.4 5.9 5.8v3.1c-2.1.1-4-.5-5.9-1.7V16c0 3.1-2.5 5.5-5.6 5.5S4.8 19.1 4.8 16c0-3.1 2.5-5.6 5.6-5.6.3 0 .6 0 .9.1v3.4c-.3-.1-.6-.2-.9-.2-1.2 0-2.2.9-2.2 2.2 0 1.2 1 2.1 2.2 2.1s2.2-.9 2.2-2.1V3h3.4z" },
  { href: "https://linkedin.com/company/visamaxtravel", label: "LinkedIn", isLinkedIn: true },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="footer__logo-block">
              <div className="footer__logo-icon">VM</div>
              <div>
                <div className="footer__logo-name">VisaMax</div>
                <div className="footer__logo-sub">Travel Ltd</div>
              </div>
            </div>
            <p className="footer__tagline">
              Your trusted travel partner for visa processing, flights, hotels, tourism and more.
            </p>
            <div className="footer__social">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {s.isStroke ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  ) : s.isLinkedIn ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__list">
              {NAV_LINKS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Our Services</h4>
            <ul className="footer__list">
              {SERVICES.map((s) => <li key={s}><a href="#services">{s}</a></li>)}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Contact Info</h4>
            <div className="footer__contact">
              <p>
                <strong>Call / WhatsApp</strong>
                <a href="tel:+2348170020431">+234 817 002 0431</a>
                <a href="tel:+2348060886447">+234 806 088 6447</a>
              </p>
              <p>
                <strong>Email</strong>
                <a href="mailto:info@visamaxtravel.com">info@visamaxtravel.com</a>
              </p>
              <p>
                <strong>Address</strong>
                51, Ayangburen Road, Opposite Ayangburen Palace,
                Top Floor, Same building as KFC and Samsung office,
                Ikorodu, Lagos.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&#169; {new Date().getFullYear()} VisaMax Travel Ltd. All rights reserved.</p>
          <p>/ visamaxtravel</p>
        </div>
      </div>
    </footer>
  );
}
