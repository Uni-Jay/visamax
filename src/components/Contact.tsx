import { useState } from "react";
import type { FormEvent } from "react";
import "./Contact.css";

// ── Formspree email delivery ──────────────────────────────────────
// 1. Visit https://formspree.io and create a free account.
// 2. Create a new form, set destination to info@visamaxtravels.com
// 3. Copy your Form ID (e.g. "xpqgkjrz") and replace YOUR_FORM_ID below.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const SERVICES = [
  "Visa Services","Flight Booking","Hotel Booking",
  "Tourism Package","Overseas Studies","Family Visa",
  "Business Travel","Expert Support","Other",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, service: form.service, message: form.message }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Failed to send. Please call us on +234 817 002 0431 or try again.");
      }
    } catch {
      setError("Network error. Please call us on +234 817 002 0431.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container contact__inner">
        <div className="contact__info">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title contact__title">Ready to Travel?<br />Let&apos;s Talk.</h2>
          <p className="contact__desc">
            Walk in, call us, or send a message. Our travel consultants are ready to help you plan the perfect journey.
          </p>

          <div className="contact__details">
            <div className="contact__detail">
              <div className="contact__det-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <span className="contact__det-label">Call / WhatsApp</span>
                <a href="tel:+2348170020431" className="contact__det-value">+234 817 002 0431</a>
                <a href="tel:+2348060886447" className="contact__det-value">+234 806 088 6447</a>
              </div>
            </div>
            <div className="contact__detail">
              <div className="contact__det-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <span className="contact__det-label">Email / Website</span>
                <a href="mailto:info@visamaxtravels.com" className="contact__det-value">info@visamaxtravels.com</a>
                <a href="http://www.visamaxtravel.com" target="_blank" rel="noopener noreferrer" className="contact__det-value">www.visamaxtravel.com</a>
              </div>
            </div>
            <div className="contact__detail">
              <div className="contact__det-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <span className="contact__det-label">Office Address</span>
                <span className="contact__det-value contact__det-address">
                  51, Ayangburen Road, Opposite Ayangburen Palace,<br />
                  Top Floor, Same building as KFC and Samsung office,<br />
                  Ikorodu, Lagos.
                </span>
              </div>
            </div>
          </div>

          <div className="contact__social">
            {[
              { href: "https://facebook.com/visamaxtravel", label: "Facebook", svg: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/> },
              { href: "https://instagram.com/visama_travels", label: "Instagram", svg: <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
              { href: "https://www.tiktok.com/@visa.max0", label: "TikTok", svg: <path d="M16 3c.6 3.4 2.7 5.4 5.9 5.8v3.1c-2.1.1-4-.5-5.9-1.7V16c0 3.1-2.5 5.5-5.6 5.5S4.8 19.1 4.8 16c0-3.1 2.5-5.6 5.6-5.6.3 0 .6 0 .9.1v3.4c-.3-.1-.6-.2-.9-.2-1.2 0-2.2.9-2.2 2.2 0 1.2 1 2.1 2.2 2.1s2.2-.9 2.2-2.1V3h3.4z"/> },
              { href: "https://linkedin.com/company/visamaxtravel", label: "LinkedIn", svg: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></> },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="contact__soc">
                <svg viewBox="0 0 24 24" fill="currentColor">{s.svg}</svg>
              </a>
            ))}
          </div>
        </div>

        <div className="contact__form-wrap">
          {sent ? (
            <div className="contact__success">
              <div className="contact__success-icon">&#10003;</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. A VisaMax consultant will contact you within 24 hours.</p>
              <button className="btn btn--red" onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              <h3 className="contact__form-title">Send Us a Message</h3>
              {error && <p className="contact__form-error">{error}</p>}
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="c-name">Full Name *</label>
                  <input id="c-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div className="form-field">
                  <label htmlFor="c-email">Email Address *</label>
                  <input id="c-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="c-phone">Phone Number</label>
                  <input id="c-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234..." />
                </div>
                <div className="form-field">
                  <label htmlFor="c-service">Service Interested In</label>
                  <select id="c-service" name="service" value={form.service} onChange={handleChange}>
                    <option value="">Select a service...</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="c-msg">Message *</label>
                <textarea id="c-msg" name="message" required value={form.message} onChange={handleChange} placeholder="Tell us about your travel plans..." rows={5} />
              </div>
              <button type="submit" disabled={loading} className="btn btn--red contact__submit">
                {loading ? "Sending\u2026" : "Send Message \u2192"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
