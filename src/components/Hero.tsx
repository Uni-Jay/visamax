import "./Hero.css";

const TICKER = [
  "Visa Services","Flight Booking","Hotel Booking","Tourism",
  "Overseas Studies","Family Visas","Business Travel","Expert Support",
];

export default function Hero() {
  const items = [...TICKER, ...TICKER];
  return (
    <section className="hero" id="home">
      <div className="hero__bg" aria-hidden />
      <div className="container hero__inner">
        <div className="hero__text">
          <span className="hero__eyebrow">Nigeria&apos;s Trusted Travel Partner</span>
          <h1 className="hero__title">
            Your Journey,{" "}
            <span className="hero__title-accent">Our Expertise.</span>
          </h1>
          <p className="hero__desc">
            Visa processing, flight bookings, hotel reservations, tourism packages,
            overseas education and more � handled end-to-end with professionalism and care.
          </p>
          <div className="hero__actions">
            <a href="#contact" className="btn btn--red">Book a Consultation</a>
            <a href="#services" className="btn btn--outline">Our Services</a>
          </div>
        </div>

        <div className="hero__right">
          <div className="hero__stat-grid">
            {[
              { n: "5,000+", l: "Visas Processed" },
              { n: "10+",    l: "Years Experience" },
              { n: "50+",    l: "Countries Covered" },
              { n: "3,000+", l: "Happy Clients" },
            ].map((s) => (
              <div key={s.l} className="hero__stat">
                <span className="hero__stat-number">{s.n}</span>
                <span className="hero__stat-label">{s.l}</span>
              </div>
            ))}
          </div>

          <div className="hero__contact-strip">
            <div className="hero__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span>+234 817 002 0431</span>
            </div>
            <div className="hero__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Ikorodu, Lagos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__ticker" aria-hidden>
        <div className="hero__ticker-track">
          {items.map((s, i) => (
            <span key={i} className="hero__ticker-item">
              {s}<span className="hero__ticker-sep">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
