import { Menu, Phone } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { callNowLabel } from '../../content/navigation';
import { phone } from '../../content/site';
import { useScrolled } from '../../hooks/useScrolled';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { DesktopNav } from './DesktopNav';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { UtilityBar } from './UtilityBar';

/**
 * Sticky header with a fixed bar height (72px phones / 88px desktop), so scrolling never shifts the page.
 * The logo sits fully inside the bar, vertically centred: 58px / 72px tall, easing to 50px / 60px once
 * scrolled (transform only). Navigation, a hairline divider and the Call Now button share one centre line.
 */
export function Header() {
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <UtilityBar />
      <header
        className={`on-dark sticky top-0 z-50 border-b bg-navy text-white transition-[box-shadow,border-color] duration-300 ${
          scrolled ? 'border-white/10 shadow-header' : 'border-transparent'
        }`}
      >
        <Container className="flex h-[72px] items-center gap-6 lg:h-[88px]">
          <a href="/" aria-label="Anderson Law Firm, PC home page" className="flex shrink-0 items-center rounded-sm">
            <Logo
              variant="white"
              className={`h-[58px] origin-left transition-transform duration-300 ease-out lg:h-[72px] ${
                scrolled ? 'scale-[0.86] lg:scale-[0.83]' : ''
              }`}
            />
          </a>

          <div className="ml-auto flex items-center gap-2 lg:gap-6">
            <DesktopNav />
            <span aria-hidden="true" className="hidden h-6 w-px bg-white/15 lg:block" />
            {/* On phones the sticky bottom action bar carries the call button instead. */}
            <span className="hidden md:block">
              <Button
                href={phone.href}
                size="sm"
                aria-label={`${callNowLabel}, ${phone.display}`}
                icon={<Phone className="size-[17px]" />}
              >
                {callNowLabel}
              </Button>
            </span>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
              className="-mr-1.5 inline-flex size-11 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu aria-hidden="true" className="size-7" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </Container>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} returnFocusRef={menuButtonRef} />
    </>
  );
}
