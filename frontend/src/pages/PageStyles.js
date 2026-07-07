/**
 * Estilos compartilhados das páginas de conteúdo (Terms, Privacy, Refund, About).
 * Usa os tokens do design system do site (variáveis CSS do index.css) e as
 * fontes globais Clash Display (títulos) / Satoshi (texto) — com isso as
 * páginas seguem o tema do site e se adaptam ao dark mode automaticamente.
 */
export const sharedStyles = `
  .sx-root {
    font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: hsl(var(--background));
    min-height: 100vh;
    color: hsl(var(--foreground));
  }

  .sx-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: hsl(var(--accent));
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
    color: hsl(var(--muted-foreground));
    text-decoration: none;
    transition: color 0.15s;
    margin-bottom: 2.5rem;
  }
  .sx-back:hover { color: hsl(var(--foreground)); }
  .sx-back svg { width: 13px; height: 13px; }

  .sx-sidebar-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: hsl(var(--muted-foreground));
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
    font-family: 'Satoshi', sans-serif;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    line-height: 1.45;
  }
  .sx-nav-item:hover { color: hsl(var(--foreground)); border-left-color: hsl(var(--border)); }
  .sx-nav-item.active { color: hsl(var(--accent)); border-left-color: hsl(var(--accent)); font-weight: 500; }

  /* ── MAIN ── */
  .sx-tag {
    display: inline-block;
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    padding: 3px 10px;
    border-radius: 100px;
    margin-bottom: 1.75rem;
  }
  .sx-page-title {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 600;
    letter-spacing: -1.5px;
    line-height: 1.08;
    color: hsl(var(--foreground));
    margin: 0 0 0.6rem;
  }
  .sx-date {
    font-size: 12.5px;
    color: hsl(var(--muted-foreground));
    font-weight: 400;
    margin: 0 0 3rem;
    letter-spacing: 0.02em;
  }

  /* ── SECTION ── */
  .sx-section {
    padding: 2.75rem 0 2rem;
    border-bottom: 1px solid hsl(var(--border));
    position: relative;
    scroll-margin-top: 2rem;
  }
  .sx-section:last-child { border-bottom: none; }

  .sx-section-num {
    font-family: 'Clash Display', sans-serif;
    font-size: 68px;
    font-weight: 600;
    color: hsl(var(--muted));
    line-height: 1;
    position: absolute;
    top: 1.25rem;
    right: 0;
    pointer-events: none;
    user-select: none;
    letter-spacing: -2px;
  }
  .sx-h2 {
    font-family: 'Clash Display', sans-serif;
    font-size: 21px;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin: 0 0 1.1rem;
    line-height: 1.3;
  }
  .sx-h3 {
    font-size: 10.5px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: hsl(var(--accent));
    margin: 1.5rem 0 0.6rem;
  }
  .sx-p {
    font-size: 14.5px;
    line-height: 1.78;
    color: hsl(var(--muted-foreground));
    font-weight: 400;
    margin: 0 0 0.85rem;
  }
  .sx-p strong { font-weight: 500; color: hsl(var(--foreground)); }

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
    color: hsl(var(--muted-foreground));
    padding: 6px 10px;
    background: hsl(var(--muted));
    border-radius: 4px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-weight: 400;
    line-height: 1.45;
  }
  .sx-li::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: hsl(var(--accent));
    flex-shrink: 0;
    margin-top: 5px;
  }
  .sx-li strong { font-weight: 500; color: hsl(var(--foreground)); }

  .sx-warning {
    background: hsl(var(--accent) / 0.08);
    border-left: 2px solid hsl(var(--accent));
    padding: 0.75rem 1rem;
    border-radius: 0 4px 4px 0;
    font-size: 13.5px;
    color: hsl(var(--foreground));
    margin-top: 1rem;
    font-weight: 400;
    line-height: 1.65;
  }
  .sx-link {
    color: hsl(var(--accent));
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
