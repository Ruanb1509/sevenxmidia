import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { sharedStyles } from "./PageStyles.js";

const sections = [
  { id: "s1",  label: "Service Description" },
  { id: "s2",  label: "Acceptance of Terms" },
  { id: "s3",  label: "Eligibility" },
  { id: "s4",  label: "Account Responsibilities" },
  { id: "s5",  label: "Subscription & Billing" },
  { id: "s6",  label: "Acceptable Use" },
  { id: "s7",  label: "Intellectual Property" },
  { id: "s8",  label: "Service Availability" },
  { id: "s9",  label: "Limitation of Liability" },
  { id: "s10", label: "Cancellation" },
  { id: "s11", label: "Termination by Us" },
  { id: "s12", label: "Lifetime Plan" },
  { id: "s13", label: "Indemnification" },
  { id: "s14", label: "Changes to Terms" },
  { id: "s15", label: "Governing Law" },
  { id: "s16", label: "Contact" },
];

const TermsPage = () => {
  const [activeId, setActiveId] = useState("s1");
  const [progress, setProgress] = useState(0);
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      let cur = "s1";
      for (const s of sections) {
        if (refs.current[s.id]?.getBoundingClientRect().top <= 90) cur = s.id;
      }
      setActiveId(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) =>
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="sx-root" data-testid="terms-page">
        <div className="sx-progress" style={{ width: `${progress}%` }} />

        <div className="sx-layout">
          {/* ── SIDEBAR ── */}
          <aside className="sx-sidebar">
            <Link to="/" className="sx-back" data-testid="back-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to Home
            </Link>
            <p className="sx-sidebar-label">Contents</p>
            {sections.map((s) => (
              <button
                key={s.id}
                className={`sx-nav-item ${activeId === s.id ? "active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </aside>

          {/* ── MAIN ── */}
          <main>
            <span className="sx-tag">Legal Document</span>
            <h1 className="sx-page-title" data-testid="terms-title">Terms of Service</h1>
            <p className="sx-date">Last updated: July 7, 2026</p>

            <section id="s1" ref={(el) => (refs.current.s1 = el)} className="sx-section">
              <span className="sx-section-num">01</span>
              <h2 className="sx-h2">Service Description</h2>
              <p className="sx-p">
                SevenX Media ("we", "our", "us") operates sevenxmedia.io, a SaaS platform that provides ad optimization technology for web publishers.
                For each website visitor, our script selects — based on the visitor's region — the ad network expected to perform well for that audience,
                and routes the impression accordingly. Results depend on your traffic and on the ad networks involved; no specific outcome is guaranteed.
              </p>
              <p className="sx-p">The Service includes: access to the optimization script, the analytics dashboard, and related features.</p>
              <p className="sx-p">
                The Service routes impressions between the ad networks used on your site. You maintain your own
                accounts with each ad network, and each network pays you directly under its own terms. SevenX Media
                does not collect, hold, or intermediate your advertising revenue — our only charge is the
                subscription fee for the Service.
              </p>
            </section>

            <section id="s2" ref={(el) => (refs.current.s2 = el)} className="sx-section">
              <span className="sx-section-num">02</span>
              <h2 className="sx-h2">Acceptance of Terms</h2>
              <p className="sx-p">By creating an account or using the platform, you agree to these Terms. If you do not agree, do not use the Service.</p>
            </section>

            <section id="s3" ref={(el) => (refs.current.s3 = el)} className="sx-section">
              <span className="sx-section-num">03</span>
              <h2 className="sx-h2">Eligibility</h2>
              <p className="sx-p">You must be at least 18 years old and legally able to enter into this agreement.</p>
            </section>

            <section id="s4" ref={(el) => (refs.current.s4 = el)} className="sx-section">
              <span className="sx-section-num">04</span>
              <h2 className="sx-h2">Account Responsibilities</h2>
              <p className="sx-p">You are responsible for your account credentials and all activity under your account. Unauthorized sharing or resale is prohibited.</p>
            </section>

            <section id="s5" ref={(el) => (refs.current.s5 = el)} className="sx-section">
              <span className="sx-section-num">05</span>
              <h2 className="sx-h2">Subscription Plans and Billing</h2>
              <p className="sx-p">
                We offer monthly, annual, and lifetime plans. Recurring plans renew automatically unless canceled.
                Payments are processed by third-party providers and we do not store card data.
              </p>
            </section>

            <section id="s6" ref={(el) => (refs.current.s6 = el)} className="sx-section">
              <span className="sx-section-num">06</span>
              <h2 className="sx-h2">Acceptable Use Policy</h2>
              <h3 className="sx-h3">Prohibited Content</h3>
              <ul className="sx-ul grid2">
                {["Adult or pornographic content","Gambling or betting services","Illegal drugs or substances","Weapons or explosives","Violence, hate or discrimination","Minor exploitation","Fraud, phishing or scams","Malware or malicious software","Pirated or counterfeit content","Ponzi or pyramid schemes"].map((i) => (
                  <li key={i} className="sx-li">{i}</li>
                ))}
              </ul>
              <h3 className="sx-h3">Prohibited Activities</h3>
              <ul className="sx-ul grid2">
                {["Artificial traffic (bots, fake clicks)","Ad fraud or manipulation","Reverse engineering the script","Reselling without authorization","Circumventing security systems"].map((i) => (
                  <li key={i} className="sx-li">{i}</li>
                ))}
              </ul>
              <div className="sx-warning">Violations may result in immediate account termination without refund.</div>
              <h3 className="sx-h3">Ad Network Policies</h3>
              <p className="sx-p">
                You are responsible for complying with the policies and terms of each ad network you connect
                to the Service — including content, placement, format, and consent requirements. SevenX Media
                is an independent tool and is not affiliated with, endorsed by, sponsored by, or certified by
                any ad network. All ad network names and trademarks belong to their respective owners.
              </p>
            </section>

            <section id="s7" ref={(el) => (refs.current.s7 = el)} className="sx-section">
              <span className="sx-section-num">07</span>
              <h2 className="sx-h2">Intellectual Property</h2>
              <p className="sx-p">All technology, scripts, and systems belong to SevenX Media. You receive a limited, non-transferable license.</p>
            </section>

            <section id="s8" ref={(el) => (refs.current.s8 = el)} className="sx-section">
              <span className="sx-section-num">08</span>
              <h2 className="sx-h2">Service Availability</h2>
              <p className="sx-p">We do not guarantee uninterrupted service or specific revenue results.</p>
              <p className="sx-p">Metrics displayed in the SevenX Media dashboard (such as revenue, impressions, and RPM) are estimates and may include small variations. The authoritative figures are those reported in the dashboard of each ad network that serves your traffic.</p>
            </section>

            <section id="s9" ref={(el) => (refs.current.s9 = el)} className="sx-section">
              <span className="sx-section-num">09</span>
              <h2 className="sx-h2">Limitation of Liability</h2>
              <p className="sx-p">Liability is limited to the amount paid in the last 12 months. We are not responsible for indirect damages or third-party issues.</p>
            </section>

            <section id="s10" ref={(el) => (refs.current.s10 = el)} className="sx-section">
              <span className="sx-section-num">10</span>
              <h2 className="sx-h2">Cancellation</h2>
              <p className="sx-p">You may cancel anytime. Access remains until the end of the billing cycle. No refunds for the current period.</p>
            </section>

            <section id="s11" ref={(el) => (refs.current.s11 = el)} className="sx-section">
              <span className="sx-section-num">11</span>
              <h2 className="sx-h2">Termination by Us</h2>
              <p className="sx-p">We may terminate accounts for violations, legal requirements, or inactivity.</p>
            </section>

            <section id="s12" ref={(el) => (refs.current.s12 = el)} className="sx-section">
              <span className="sx-section-num">12</span>
              <h2 className="sx-h2">Lifetime Plan</h2>
              <p className="sx-p">Lifetime access applies while the service operates. If discontinued, 90 days notice will be provided.</p>
            </section>

            <section id="s13" ref={(el) => (refs.current.s13 = el)} className="sx-section">
              <span className="sx-section-num">13</span>
              <h2 className="sx-h2">Indemnification</h2>
              <p className="sx-p">You agree to indemnify SevenX Media against claims related to your use of the service.</p>
            </section>

            <section id="s14" ref={(el) => (refs.current.s14 = el)} className="sx-section">
              <span className="sx-section-num">14</span>
              <h2 className="sx-h2">Changes to Terms</h2>
              <p className="sx-p">Terms may be updated with 15 days notice. Continued use means acceptance.</p>
            </section>

            <section id="s15" ref={(el) => (refs.current.s15 = el)} className="sx-section">
              <span className="sx-section-num">15</span>
              <h2 className="sx-h2">Governing Law</h2>
              <p className="sx-p">These Terms are governed by the laws of Brazil. Jurisdiction: Sete Lagoas, Minas Gerais.</p>
            </section>

            <section id="s16" ref={(el) => (refs.current.s16 = el)} className="sx-section">
              <span className="sx-section-num">16</span>
              <h2 className="sx-h2">Contact</h2>
              <p className="sx-p">
                For questions or concerns, reach us at{" "}
                <a href="mailto:support@sevenxmedia.io" className="sx-link">support@sevenxmedia.io</a>
              </p>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default TermsPage;