import { useState, useEffect } from "react";
import "./Header.css";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

function BrandMark() {
  return (
    <div className="header__brand">
      <div className="header__brand-logo">VM</div>
      <div className="header__brand-text">
        <span className="header__brand-name">VisaMax</span>
        <span className="header__brand-sub">Travel Ltd</span>
      </div>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="container header__inner">
        <a href="#home" className="header__logo-link" onClick={() => setOpen(false)}>
          <BrandMark />
        </a>
        <nav className={`header__nav${open ? " header__nav--open" : ""}`}>
          {NAV.map(({ label, href }) => (
            <a key={href} href={href} className="header__link" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href="#contact" className="btn btn--red header__cta" onClick={() => setOpen(false)}>
            Book Now
          </a>
        </nav>
        <button
          className={`header__burger${open ? " header__burger--open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
