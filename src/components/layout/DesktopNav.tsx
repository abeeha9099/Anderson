import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { isGroup, navigation, type NavGroup } from '../../content/navigation';

/**
 * Top-level item: 44px tall. A 1px sky underline draws in on hover and marks the current page / open menu.
 */
const topLink = [
  'relative inline-flex h-11 items-center gap-1 rounded-md px-2.5 font-display text-[15px] font-medium text-white/80 xl:px-3',
  'transition-colors duration-200 hover:text-white aria-[current=page]:text-white aria-expanded:text-white',
  'after:pointer-events-none after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-sky xl:after:inset-x-3',
  'after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 aria-expanded:after:scale-x-100',
].join(' ');

/**
 * Desktop navigation using the WAI "disclosure navigation" pattern:
 * buttons with aria-expanded, Escape to close, closes when focus leaves.
 * Hover opens on fine pointers with a short intent delay.
 */
export function DesktopNav() {
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hoverOpen = (label: string) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(label), 90);
  };
  const hoverClose = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(null), 160);
  };

  return (
    <nav ref={navRef} aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center xl:gap-1">
        {navigation.map((item) =>
          isGroup(item) ? (
            <NavDisclosure
              key={item.label}
              group={item}
              open={open === item.label}
              onToggle={() => setOpen((cur) => (cur === item.label ? null : item.label))}
              onClose={() => setOpen(null)}
              onHoverOpen={() => hoverOpen(item.label)}
              onHoverClose={hoverClose}
            />
          ) : (
            <li key={item.label}>
              <a href={item.href} className={topLink} aria-current={item.href === '/' ? 'page' : undefined}>
                {item.label}
              </a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

function NavDisclosure({
  group,
  open,
  onToggle,
  onClose,
  onHoverOpen,
  onHoverClose,
}: {
  group: NavGroup;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onHoverOpen: () => void;
  onHoverClose: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = `nav-${group.label.toLowerCase().replace(/\W+/g, '-')}`;
  const wide = group.sections.length > 1;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      onClose();
      buttonRef.current?.focus();
    }
  };
  const onBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
  };

  return (
    <li
      className="relative"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onHoverOpen()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onHoverClose()}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className={`${topLink} ${open ? 'text-white' : ''}`}
      >
        {group.label}
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 text-sky/90 transition-transform duration-300 ease-out ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id={id}
        // Animated open/close (fade + 6px drop). When closed it is visibility:hidden, so it stays out of
        // the tab order and the accessibility tree, exactly like the `hidden` attribute.
        data-open={open}
        className={`dropdown-panel absolute top-full z-50 pt-3 ${wide ? 'right-0 w-[min(30rem,80vw)]' : 'left-0 w-72'}`}
      >
        <div className="overflow-hidden rounded-md bg-white py-2 text-ink shadow-panel ring-1 ring-navy/5">
          {group.sections.map((section, i) => (
            <div key={i} className={i > 0 ? 'mt-2 border-t border-line/30 pt-2' : ''}>
              {section.heading && (
                <p className="px-5 pt-2 pb-1 font-display text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                  {section.heading}
                </p>
              )}
              <ul className={wide && i === 0 ? 'grid grid-cols-2' : ''}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={() => link.href.startsWith('#') && onClose()}
                      className="flex min-h-11 items-center border-l-2 border-transparent px-5 font-display text-[15px] text-ink transition-colors duration-150 hover:border-primary hover:bg-mist hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}
