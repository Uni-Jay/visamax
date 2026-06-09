import "./About.css";

const POINTS = [
  { title: "Licensed & Accredited", desc: "Fully registered travel agency compliant with Nigerian immigration and tourism regulations." },
  { title: "Nigeria-Focused Expertise", desc: "Deep knowledge of Nigerian passport requirements, embassy procedures and travel documentation." },
  { title: "End-to-End Service", desc: "From application to departure, we handle every step so you can focus on your journey." },
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container about__inner">
        <div className="about__visual">
          <div className="about__brand-block">
            <div className="about__brand-icon">VM</div>
            <div className="about__brand-lines">
              <span className="about__brand-name">VisaMax</span>
              <span className="about__brand-sub">Travel Ltd</span>
              <span className="about__brand-tag">Your Journey, Our Expertise</span>
            </div>
          </div>
          <div className="about__decoration">
            <div className="about__deco-box about__deco-box--1" />
            <div className="about__deco-box about__deco-box--2" />
          </div>
          <div className="about__badge">
            <span className="about__badge-number">10+</span>
            <span className="about__badge-text">Years Serving Travelers</span>
          </div>
        </div>

        <div className="about__content">
          <span className="section-label">About Us</span>
          <h2 className="section-title">We Are VisaMax Travel Ltd</h2>
          <p className="about__lead">
            Based in Ikorodu, Lagos, VisaMax Travel Ltd is a full-service travel agency dedicated to making international and domestic travel seamless for individuals, families, and businesses.
          </p>
          <p className="about__body">
            Since our founding, we have helped thousands of Nigerians obtain visas, book flights, secure accommodations, and embark on educational journeys abroad. Our team of experienced travel consultants brings unmatched expertise to every client interaction.
          </p>
          <div className="about__points">
            {POINTS.map((p) => (
              <div key={p.title} className="about__point">
                <div className="about__point-check">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <strong className="about__point-title">{p.title}</strong>
                  <p className="about__point-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#contact" className="btn btn--navy">Talk to an Expert</a>
        </div>
      </div>
    </section>
  );
}
