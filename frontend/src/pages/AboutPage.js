import React from "react";
import { Link } from "react-router-dom";
import { sharedStyles } from "./Pagestyles.js";

const aboutExtra = `
  .ab-headline {
    font-family: 'Lora', serif;
    font-size: clamp(38px, 5.5vw, 58px);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -1.5px;
    color: #1a1916;
    margin: 0 0 3rem;
  }
  .ab-headline em { font-style: italic; color: #b8862e; }

  .ab-divider {
    width: 32px;
    height: 1.5px;
    background: #c8a85e;
    margin-bottom: 3rem;
  }

  .ab-pillars {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid #e8e4da;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 3rem;
  }
  .ab-pillar {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1.5rem 1.75rem;
    border-bottom: 1px solid #e8e4da;
    background: #f9f8f6;
    transition: background 0.15s;
  }
  .ab-pillar:last-child { border-bottom: none; }
  .ab-pillar:hover { background: #f4f1eb; }

  .ab-pillar-num {
    font-family: 'Lora', serif;
    font-size: 13px;
    font-weight: 600;
    color: #c8a85e;
    flex-shrink: 0;
    padding-top: 2px;
    min-width: 24px;
  }
  .ab-pillar-body {}
  .ab-pillar-title {
    font-family: 'Lora', serif;
    font-size: 15.5px;
    font-weight: 600;
    color: #1a1916;
    margin-bottom: 0.3rem;
  }
  .ab-pillar-desc {
    font-size: 13.5px;
    line-height: 1.65;
    color: #7a7568;
    font-weight: 300;
  }

  .ab-closing {
    margin-top: 4rem;
    padding-top: 2.5rem;
    border-top: 1px solid #e8e4da;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .ab-closing-text {
    font-family: 'Lora', serif;
    font-size: 18px;
    font-style: italic;
    color: #9a9387;
    line-height: 1.5;
  }
  .ab-contact {
    font-size: 12.5px;
    color: #9a9387;
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
              Our optimization engine combines <strong>statistical modeling with real-time data</strong> to
              ensure every impression is served by the highest-performing network for that specific
              visitor — automatically, with zero manual effort.
            </p>
          </section>

          <section id="how" style={{ scrollMarginTop: "2rem" }}>
            <div className="ab-pillars">
              <div className="ab-pillar">
                <span className="ab-pillar-num">01</span>
                <div className="ab-pillar-body">
                  <p className="ab-pillar-title">Statistical modeling</p>
                  <p className="ab-pillar-desc">Our engine learns continuously from historical and live eCPM data across every ad network, building a model that improves with every impression.</p>
                </div>
              </div>
              <div className="ab-pillar">
                <span className="ab-pillar-num">02</span>
                <div className="ab-pillar-body">
                  <p className="ab-pillar-title">Geo-aware routing</p>
                  <p className="ab-pillar-desc">Each impression is evaluated in real time against the visitor's geolocation, device, and contextual signals — and routed to the highest-paying network for that profile.</p>
                </div>
              </div>
              <div className="ab-pillar">
                <span className="ab-pillar-num">03</span>
                <div className="ab-pillar-body">
                  <p className="ab-pillar-title">Zero manual effort</p>
                  <p className="ab-pillar-desc">Drop in the script and the optimization runs entirely on autopilot. No dashboards to manage, no rules to configure, no maintenance required.</p>
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