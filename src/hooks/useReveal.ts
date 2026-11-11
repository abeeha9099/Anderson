import { useEffect, type CSSProperties } from 'react';

const STAGGER_CAP = 8; // matches min(var(--i), 8) in index.css

/**
 * Progressive scroll-reveal for elements marked `data-reveal` (variants: default | fade | zoom | stagger;
 * optional `data-reveal-delay` in ms). See index.css for what each variant does.
 * - Runs only after hydration, so server-rendered content is never hidden without JS.
 * - Elements already on screen (or inside hidden tab panels) are left alone: no flash, no LCP delay.
 * - Disabled entirely for prefers-reduced-motion.
 * - `reveal-in` is removed once the entrance finishes, so normal hover transitions take over again.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);
          el.style.setProperty('--reveal-delay', `${delay}ms`);
          el.classList.add('reveal-in');
          el.classList.remove('reveal-pending');
          observer.unobserve(el);

          const step = parseFloat(getComputedStyle(el).getPropertyValue('--reveal-step')) || 70;
          const total = delay + (el.dataset.reveal === 'stagger' ? STAGGER_CAP * step : 0) + 2000;
          timers.push(window.setTimeout(() => el.classList.remove('reveal-in'), total));
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    // Start one task later, after components have applied their post-hydration state (e.g. the practice
    // tabs hiding inactive panels), and skip anything inside a hidden region.
    const start = window.setTimeout(() => {
      const pending = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
        (el) => !el.closest('[hidden], [data-reveal-skip]') && el.getBoundingClientRect().top > window.innerHeight * 0.92,
      );
      for (const el of pending) {
        el.classList.add('reveal-pending');
        observer.observe(el);
      }
    }, 0);

    return () => {
      window.clearTimeout(start);
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);
}

/** Inline style giving a child its position in a `data-reveal="stagger"` / `.tab-enter` sequence. */
export const staggerIndex = (i: number) => ({ '--i': i }) as CSSProperties;
