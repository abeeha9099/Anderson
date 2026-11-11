import { ChevronDown, Mail, MapPin, Phone, X } from 'lucide-react';
import { useRef, useState, type RefObject } from 'react';
import { callNowLabel, isGroup, navigation } from '../../content/navigation';
import { hero } from '../../content/home';
import { address, email, phone } from '../../content/site';
import { useDialog } from '../../hooks/useDialog';
import { Button } from '../ui/Button';
import { Logo } from './Logo';

/**
 * Full-height menu sheet for < 1024px. Light surface with the original blue-tile logo
 * (as on the live site's mobile drawer). Replaces the theme's placeholder "Get Started" block.
 */
export function MobileMenu({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  useDialog(open, panelRef, onClose, returnFocusRef);

  if (!open) return null;

  const row =
    'flex min-h-14 w-full items-center justify-between gap-4 border-b border-line/30 font-display text-lg font-semibold text-ink';

  return (
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] lg:hidden">
      <div aria-hidden="true" className="animate-fade absolute inset-0 bg-navy/70" onClick={onClose} />
      <div
        ref={panelRef}
        className="animate-sheet absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-canvas shadow-panel"
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-line/30 px-5">
          <a href="/" aria-label="Anderson Law Firm, PC home page">
            <Logo variant="tile" className="h-14" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-mist"
          >
            <X aria-hidden="true" className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-6">
          <ul>
            {navigation.map((item) => {
              if (!isGroup(item)) {
                return (
                  <li key={item.label}>
                    <a href={item.href} className={row} onClick={onClose}>
                      {item.label}
                    </a>
                  </li>
                );
              }
              const isOpen = expanded === item.label;
              const id = `m-nav-${item.label.toLowerCase().replace(/\W+/g, '-')}`;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    className={`${row} text-left`}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-5 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div id={id} hidden={!isOpen} className="border-b border-line/30 pt-1 pb-3">
                    {item.sections.map((section, i) => (
                      <div key={i} className={i > 0 ? 'mt-2 border-t border-line/20 pt-2' : ''}>
                        {section.heading && (
                          <p className="pt-2 pb-1 pl-4 font-display text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                            {section.heading}
                          </p>
                        )}
                        <ul>
                          {section.links.map((link) => (
                            <li key={link.label}>
                              <a
                                href={link.href}
                                onClick={() => link.href.startsWith('#') && onClose()}
                                className="flex min-h-11 items-center pl-4 text-[17px] text-body transition-colors hover:text-primary"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-col text-[15px]">
            <a href={email.href} className="inline-flex min-h-11 items-center gap-2.5 text-body hover:text-primary">
              <Mail aria-hidden="true" className="size-4 text-primary" />
              {email.display}
            </a>
            <a
              href={address.directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 text-body hover:text-primary"
            >
              <MapPin aria-hidden="true" className="size-4 text-primary" />
              {address.line1} {address.line2}
              <span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
          </div>
        </nav>

        {/* Only the two primary actions stay pinned, so the menu keeps room on short phones. */}
        <div className="grid shrink-0 gap-2.5 border-t border-line/30 bg-white px-5 pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button href={phone.href} fullWidth icon={<Phone className="size-5" />} aria-label={`${callNowLabel}, ${phone.display}`}>
            {callNowLabel} <span className="font-medium text-white/80">{phone.display}</span>
          </Button>
          <Button href="#contact" variant="ghostDark" fullWidth onClick={onClose}>
            {hero.primaryCta}
          </Button>
        </div>
      </div>
    </div>
  );
}
