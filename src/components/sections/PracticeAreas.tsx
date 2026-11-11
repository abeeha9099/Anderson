import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  contactLinkLabel,
  practiceGroups,
  practiceIntro,
  type PracticeArea,
} from '../../content/practiceAreas';
import { MD_UP, useMediaQuery } from '../../hooks/useMediaQuery';
import { staggerIndex } from '../../hooks/useReveal';
import { useContact } from '../../state/ContactContext';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { practiceIcons } from '../ui/icons';

const gridCols: Record<number, string> = {
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
  6: 'md:grid-cols-2 lg:grid-cols-3',
};

/**
 * Practice areas as tabs (WAI-ARIA tabs pattern, automatic activation).
 * Before hydration / without JS every group renders in sequence, so no content is ever unreachable.
 * Hash links like #practice-estate select a tab (used by the hero quick links).
 */
export function PracticeAreas() {
  const [active, setActive] = useState(practiceGroups[0].id);
  const [enhanced, setEnhanced] = useState(false);
  /** True after the visitor changes tab; from then on, newly shown cells rise in (.tab-enter). */
  const [switched, setSwitched] = useState(false);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sectionRef = useRef<HTMLElement>(null);

  const select = (id: string) => {
    if (id !== active) setSwitched(true);
    setActive(id);
  };

  // Sliding underline under the selected tab (tablet/desktop). Re-measured on resize and once fonts load.
  useEffect(() => {
    if (!enhanced) return;
    const measure = () => {
      const tab = tabRefs.current[active];
      if (tab) setIndicator({ x: tab.offsetLeft, w: tab.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', measure);
  }, [active, enhanced]);

  useEffect(() => {
    setEnhanced(true);
    const applyHash = () => {
      const match = window.location.hash.match(/^#practice-([\w-]+)$/);
      if (!match || !practiceGroups.some((g) => g.id === match[1])) return;
      setActive(match[1]);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      sectionRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = practiceGroups.length - 1;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const id = practiceGroups[next].id;
    select(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section ref={sectionRef} id="practice-areas" aria-labelledby="practice-heading" className="bg-mist">
      <Container className="py-18 md:py-22 lg:py-26 xl:py-32">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10" data-reveal>
          <div className="lg:col-span-6">
            <Eyebrow>{practiceIntro.eyebrow}</Eyebrow>
            <h2
              id="practice-heading"
              className="mt-5 font-display text-[2rem] leading-[1.15] font-bold tracking-[-0.01em] text-ink md:text-[2.5rem] lg:text-[3rem] lg:leading-[1.1]"
            >
              {practiceIntro.heading}
            </h2>
          </div>
          <p className="text-[17px] leading-[1.7] lg:col-span-5 lg:col-start-8">{practiceIntro.body}</p>
        </div>

        {enhanced && (
          <div
            role="tablist"
            aria-label="Practice area groups"
            className="relative mt-10 grid grid-cols-2 gap-2 md:mt-14 md:flex md:gap-10 md:border-b md:border-line/40"
          >
            {indicator && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-px left-0 hidden h-0.5 bg-primary transition-[transform,width] duration-500 ease-brand md:block"
                style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }}
              />
            )}
            {practiceGroups.map((group, i) => {
              const selected = group.id === active;
              return (
                <button
                  key={group.id}
                  ref={(el) => {
                    tabRefs.current[group.id] = el;
                  }}
                  id={`tab-${group.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`practice-${group.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(group.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={[
                    'relative flex min-h-[3.25rem] items-center justify-between gap-2 rounded-md border px-4 text-left font-display text-[15px] font-semibold transition-colors duration-300',
                    'md:-mb-px md:h-14 md:justify-start md:rounded-none md:border-0 md:border-b-2 md:border-transparent md:bg-transparent md:px-0 md:text-[17px]',
                    selected
                      ? 'border-navy bg-navy text-white md:text-ink'
                      : 'border-line/40 bg-white text-ink md:text-body md:hover:text-ink',
                    // Before the sliding indicator is measured, show a static underline on the selected tab.
                    selected && !indicator ? 'md:border-primary' : '',
                  ].join(' ')}
                >
                  {group.label}
                  <span
                    className={`font-display text-xs font-semibold tabular-nums ${selected ? 'text-white/70 md:text-primary' : 'text-body'}`}
                  >
                    <span aria-hidden="true">{String(group.areas.length).padStart(2, '0')}</span>
                    <span className="sr-only">{group.areas.length} services</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {practiceGroups.map((group) => {
          const hidden = enhanced && group.id !== active;
          return (
            <div
              key={group.id}
              id={`practice-${group.id}`}
              role={enhanced ? 'tabpanel' : undefined}
              aria-labelledby={enhanced ? `tab-${group.id}` : undefined}
              tabIndex={enhanced ? 0 : undefined}
              hidden={hidden}
              className="mt-6 rounded-sm focus-visible:outline-offset-8 md:mt-0"
            >
              {!enhanced && (
                <p className="mt-12 mb-4 font-display text-lg font-semibold text-ink">{group.label}</p>
              )}
              {/* First view: cells rise in on scroll (stagger). After a tab change: cells rise in on show. */}
              <ul
                data-reveal="stagger"
                // Inactive panels opt out of the scroll reveal (decided from the first render, so it does not
                // depend on timing); they animate in with .tab-enter when selected instead.
                data-reveal-skip={group.id !== active ? '' : undefined}
                className={`grid border-t border-line/40 md:border-l ${gridCols[group.areas.length] ?? 'md:grid-cols-2 lg:grid-cols-3'} ${switched ? 'tab-enter' : ''}`}
              >
                {group.areas.map((area, i) => (
                  <li key={area.id} style={staggerIndex(i)} className="border-b border-line/40 md:border-r">
                    <PracticeCard area={area} defaultOpen={i === 0} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </Container>
    </section>
  );
}

function PracticeCard({ area, defaultOpen }: { area: PracticeArea; defaultOpen: boolean }) {
  // Tablet/desktop: static grid cell. Mobile: accordion. (Pre-rendered HTML uses the expanded layout.)
  const isMdUp = useMediaQuery(MD_UP);
  const [open, setOpen] = useState(defaultOpen);
  const expanded = isMdUp || open;
  const { requestService } = useContact();
  const Icon = practiceIcons[area.icon];
  const bodyId = `${area.id}-details`;

  // Hover (tablet/desktop): the cell lifts onto white with a soft shadow and a thin primary border
  // (inset ring, so nothing shifts). 300ms.
  return (
    <article className="group relative flex h-full flex-col transition-[background-color,box-shadow] duration-300 ease-brand md:p-8 md:hover:z-10 md:hover:bg-white md:hover:shadow-[0_24px_48px_-30px_rgb(17_18_64/0.45),inset_0_0_0_1px_rgb(38_115_164/0.3)] lg:p-9">
      <h3 className="font-display text-ink">
        {isMdUp ? (
          <span className="flex flex-col items-start gap-6">
            <Icon
              aria-hidden="true"
              className="size-7 text-primary"
              strokeWidth={1.4}
            />
            <span className="text-[1.375rem] leading-[1.25] font-semibold transition-colors duration-200 group-hover:text-primary">
              {area.title}
            </span>
          </span>
        ) : (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen((v) => !v)}
            className="flex min-h-[4.5rem] w-full items-center gap-4 py-3 text-left"
          >
            <Icon aria-hidden="true" className="size-6 shrink-0 text-primary" strokeWidth={1.5} />
            <span className="flex-1 text-lg leading-snug font-semibold">{area.title}</span>
            <ChevronDown
              aria-hidden="true"
              className={`size-5 shrink-0 text-primary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </h3>

      {/* flex-1 + description flex-1: lists and links line up across a row of cells. */}
      <div id={bodyId} data-open={expanded} className="collapsible flex-1">
        <div>
          <div className="flex h-full flex-col pb-7 md:pb-0">
            <p className="text-[15.5px] leading-[1.7] md:mt-4 md:flex-1">{area.description}</p>
            <div className="mt-5 border-t border-line/35 pt-5">
              {area.listLabel && (
                <p className="mb-3 font-display text-sm font-semibold text-ink">{area.listLabel}</p>
              )}
              <ul className="space-y-2">
                {area.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-[15px] leading-snug text-ink">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            {area.link.kind === 'page' ? (
              <a
                href={area.link.href}
                aria-label={`Read more about ${area.title}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-display text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                Read More
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            ) : (
              <a
                href="#contact"
                onClick={() => area.link.kind === 'contact' && requestService(area.link.service)}
                aria-label={`${contactLinkLabel} about ${area.title}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-display text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                {contactLinkLabel}
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
