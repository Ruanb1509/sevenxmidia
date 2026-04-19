export const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Geist:wght@300;400;500&display=swap');

  .sx-root {
    font-family: 'Geist', sans-serif;
    background: #f9f8f6;
    min-height: 100vh;
    color: #1a1916;
  }

  .sx-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: #b8862e;
    transition: width 0.15s ease;
    z-index: 100;
    pointer-events: none;
  }

  .sx-layout {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 2rem 6rem;
    display: grid;
    grid-template-columns: 190px 1fr;
    gap: 5rem;
    align-items: start;
  }

  /* ── SIDEBAR ── */
  .sx-sidebar {
    position: sticky;
    top: 2.5rem;
    max-height: calc(100vh - 5rem);
    overflow-y: auto;
    scrollbar-width: none;
  }
  .sx-sidebar::-webkit-scrollbar { display: none; }

  .sx-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9a9387;
    text-decoration: none;
    transition: color 0.15s;
    margin-bottom: 2.5rem;
  }
  .sx-back:hover { color: #1a1916; }
  .sx-back svg { width: 13px; height: 13px; }

  .sx-sidebar-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #c8b48a;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
  .sx-nav-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    border-left: 1.5px solid transparent;
    padding: 5px 0 5px 12px;
    font-size: 11.5px;
    font-family: 'Geist', sans-serif;
    color: #9a9387;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    line-height: 1.45;
  }
  .sx-nav-item:hover { color: #3a3834; border-left-color: #d4c4a0; }
  .sx-nav-item.active { color: #b8862e; border-left-color: #b8862e; font-weight: 500; }

  /* ── MAIN ── */
  .sx-tag {
    display: inline-block;
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: #ede9e0;
    color: #9a8f7a;
    padding: 3px 10px;
    border-radius: 100px;
    margin-bottom: 1.75rem;
  }
  .sx-page-title {
    font-family: 'Lora', serif;
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 600;
    letter-spacing: -1.5px;
    line-height: 1.08;
    color: #1a1916;
    margin: 0 0 0.6rem;
  }
  .sx-date {
    font-size: 12.5px;
    color: #9a9387;
    font-weight: 300;
    margin: 0 0 3rem;
    letter-spacing: 0.02em;
  }

  /* ── SECTION ── */
  .sx-section {
    padding: 2.75rem 0 2rem;
    border-bottom: 1px solid #e8e4da;
    position: relative;
    scroll-margin-top: 2rem;
  }
  .sx-section:last-child { border-bottom: none; }

  .sx-section-num {
    font-family: 'Lora', serif;
    font-size: 68px;
    font-weight: 600;
    color: #ede9e0;
    line-height: 1;
    position: absolute;
    top: 1.25rem;
    right: 0;
    pointer-events: none;
    user-select: none;
    letter-spacing: -2px;
  }
  .sx-h2 {
    font-family: 'Lora', serif;
    font-size: 21px;
    font-weight: 600;
    color: #1a1916;
    margin: 0 0 1.1rem;
    line-height: 1.3;
  }
  .sx-h3 {
    font-size: 10.5px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #b8862e;
    margin: 1.5rem 0 0.6rem;
  }
  .sx-p {
    font-size: 14.5px;
    line-height: 1.78;
    color: #4a4844;
    font-weight: 300;
    margin: 0 0 0.85rem;
  }
  .sx-p strong { font-weight: 500; color: #2a2824; }

  .sx-ul {
    list-style: none;
    margin: 0 0 0.85rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .sx-ul.grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px 1.25rem;
  }
  .sx-li {
    font-size: 13.5px;
    color: #4a4844;
    padding: 6px 10px;
    background: #f0ede6;
    border-radius: 4px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-weight: 300;
    line-height: 1.45;
  }
  .sx-li::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #c8a85e;
    flex-shrink: 0;
    margin-top: 5px;
  }
  .sx-li strong { font-weight: 500; color: #2a2824; }

  .sx-warning {
    background: #fdf4e7;
    border-left: 2px solid #c8a85e;
    padding: 0.75rem 1rem;
    border-radius: 0 4px 4px 0;
    font-size: 13.5px;
    color: #5a4820;
    margin-top: 1rem;
    font-weight: 300;
    line-height: 1.65;
  }
  .sx-link {
    color: #b8862e;
    text-decoration: none;
  }
  .sx-link:hover { text-decoration: underline; }

  @media (max-width: 760px) {
    .sx-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .sx-sidebar { position: static; max-height: none; }
    .sx-ul.grid2 { grid-template-columns: 1fr; }
    .sx-section-num { font-size: 48px; }
  }
`;