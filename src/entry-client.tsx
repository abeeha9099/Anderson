// Original brand fonts (Cabin + Mukta), self-hosted, Latin subset only.
import '@fontsource/cabin/latin-400.css';
import '@fontsource/cabin/latin-500.css';
import '@fontsource/cabin/latin-500-italic.css';
import '@fontsource/cabin/latin-600.css';
import '@fontsource/cabin/latin-700.css';
import '@fontsource/mukta/latin-400.css';
import '@fontsource/mukta/latin-500.css';
import '@fontsource/mukta/latin-600.css';
import './index.css';

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is pre-rendered at build time (scripts/prerender.mjs) — hydrate it.
// In development the root is empty, so render normally.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
