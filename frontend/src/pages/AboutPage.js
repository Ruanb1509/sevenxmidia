import React from "react";
import { Link } from "react-router-dom";
import { sharedStyles } from "./PageStyles.js";

const aboutExtra = `
  .ab-headline {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(38px, 5.5vw, 58px);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -1.5px;
    color: hsl(var(--foreground));
    margin: 0 0 3rem;
  }
  .ab-headline em { font-style: italic; color: hsl(var(--accent)); }

  .ab-divider {
    width: 32px;
    height: 1.5px;
    background: hsl(var(--accent));
    margin-bottom: 3rem;
  }

  .ab-pillars {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    overflow: hidden;
    margin-top: 3rem;
  }
  .ab-pillar {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1.5rem 1.75rem;
    border-bottom: 1px solid hsl(var(--border));
    background: hsl(var(--card));
    transition: background 0.15s;
  }
  .ab-pillar:last-child { border-bottom: none; }
  .ab-pillar:hover { background: hsl(var(--muted)); }

  .ab-pillar-num {
    font-family: 'Clash Display', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: hsl(var(--accent));
    flex-shrink: 0;
    padding-top: 2px;
    min-width: 24px;
  }
  .ab-pillar-body {}
  .ab-pillar-title {
    font-family: 'Clash Display', sans-serif;
    font-size: 15.5px;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.3rem;
  }
  .ab-pillar-desc {
    font-size: 13.5px;
    line-height: 1.65;
    color: hsl(var(--muted-foreground));
    font-weight: 400;
  }

  .ab-closing {
    margin-top: 4rem;
    padding-top: 2.5rem;
    border-top: 1px solid hsl(var(--border));
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .ab-closing-text {
    font-size: 18px;
    font-style: italic;
    color: hsl(var(--muted-foreground));
    line-height: 1.5;
  }
  .ab-contact {
    font-size: 12.5px;
    color: hsl(var(--muted-foreground));
    flex-shrink: 0;
  }
`;

const AboutPage = () => (
  <>
    <style>{sharedStyles + aboutExtra}</style>
    <div className="sx-root">
      <div className="sx-layout">

        {/* ── SIDEBAR ── */}
        <aside className="sx-sidebar">
          <Link to="/" className="sx-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Home
          </Link>
          <p className="sx-sidebar-label">On this page</p>
          {[["Mission", "mission"], ["How it works", "how"], ["Get in touch", "contact"]].map(([label, id]) => (
            <button
              key={id}
              className="sx-nav-item"
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* ── MAIN ── */}
        <main>
          <span className="sx-tag">About</span>

          <h1 className="ab-headline">
            Built to stop<br />
            leaving money<br />
            on the <em>table.</em>
          </h1>

          <div className="ab-divider" />

          <section id="mission" style={{ scrollMarginTop: "2rem" }}>
            <p className="sx-p">
              SevenX Media was built to solve a real problem: <strong>publishers with international
              traffic leaving money on the table</strong> by using a single ad network for all visitors.
            </p>
            <p className="sx-p">
              Our routing engine uses <strong>per-region performance data</strong> so that each impression
              is served by the network most likely to perform well for that visitor — automatically,
              with no manual effort on your side.
            </p>
            <p className="sx-p">
              <strong>Your accounts, your revenue.</strong> You keep your own ad network accounts and your
              own ad tags — each network keeps paying you directly, exactly as it does today. SevenX Media
              never receives, holds, or intermediates your advertising revenue; our only charge is the
              subscription. For example: if you monetize with a single network today, adding a second one
              lets the script decide, visitor by visitor, which of the two is likely to be worth more for
              that visitor's country — based on the regional performance data we track.
            </p>
          </section>

          <section id="how" style={{ scrollMarginTop: "2rem" }}>
            <div className="ab-pillars">
              <div className="ab-pillar">
                <span className="ab-pillar-num">01</span>
                <div className="ab-pillar-body">
                  <p className="ab-pillar-title">Weighted network selection</p>
                  <p className="ab-pillar-desc">Impressions are distributed across networks using per-region weights based on performance estimates (eCPM), favoring the networks that tend to deliver better results for each audience.</p>
                </div>
              </div>
              <div className="ab-pillar">
                <span className="ab-pillar-num">02</span>
                <div className="ab-pillar-body">
                  <p className="ab-pillar-title">Geo-aware routing</p>
                  <p className="ab-pillar-desc">Each impression is evaluated in real time based on the visitor's region and routed to the network expected to perform best for that audience.</p>
                </div>
              </div>
              <div className="ab-pillar">
                <span className="ab-pillar-num">03</span>
                <div className="ab-pillar-body">
                  <p className="ab-pillar-title">Simple by design</p>
                  <p className="ab-pillar-desc">Install the snippet once and routing runs automatically. Your dashboard shows estimated results — no rules to configure, no maintenance required.</p>
                </div>
              </div>
            </div>
          </section>

          <div id="contact" className="ab-closing" style={{ scrollMarginTop: "2rem" }}>
            <p className="ab-closing-text">
              "Every visitor deserves<br />the right ad network."
            </p>
            <p className="ab-contact">
              Questions?{" "}
              <a href="mailto:support@sevenxmedia.io" className="sx-link">support@sevenxmedia.io</a>
            </p>
          </div>
        </main>

      </div>
    </div>
  </>
);

export default AboutPage;