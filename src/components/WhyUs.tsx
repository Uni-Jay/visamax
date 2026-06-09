import "./WhyUs.css";

const REASONS = [
  { n: "01", title: "High Visa Success Rate", desc: "Thorough preparation and document verification ensures maximum approval rates for all visa categories." },
  { n: "02", title: "Transparent Pricing", desc: "No hidden charges. We provide clear, upfront quotations for every service we offer." },
  { n: "03", title: "Fast Turnaround", desc: "We work within tight deadlines without compromising quality or accuracy." },
  { n: "04", title: "Personalized Service", desc: "Every client gets dedicated attention tailored to their specific situation and travel goals." },
  { n: "05", title: "Trusted Track Record", desc: "Over 5,000 successful applications and thousands of satisfied clients since inception." },
  { n: "06", title: "Locally Based, Globally Connected", desc: "Located in Ikorodu, Lagos with connections to embassies, airlines and hotels worldwide." },
];

export default function WhyUs() {
  return (
    <section className="why-us" id="why-us">
      <div className="container">
        <div className="why-us__header">
          <span className="section-label why-us__label">Why Choose Us</span>
          <h2 className="section-title why-us__title">Reasons to Trust VisaMax</h2>
          <p className="section-desc why-us__desc">
            We combine local expertise with global reach to deliver travel experiences that are smooth, reliable and tailored to you.
          </p>
        </div>
        <div className="why-us__grid">
          {REASONS.map((r) => (
            <div key={r.n} className="why-card">
              <span className="why-card__number">{r.n}</span>
              <h3 className="why-card__title">{r.title}</h3>
              <p className="why-card__desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
