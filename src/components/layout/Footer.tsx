import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { footerGroups } from '../../content/footer';
import { MD_UP, useMediaQuery } from '../../hooks/useMediaQuery';
import { address, copyrightName, email, leaveReview, phone, privacyPolicy, socials } from '../../content/site';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { BrandIcon } from '../ui/icons';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="on-dark bg-navy text-white">
      {/* Extra bottom space on phones so the fixed action bar never covers the last line. */}
      <Container className="pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <a href="/" aria-label="Anderson Law Firm, PC home page" className="inline-block rounded-sm">
              <Logo variant="white" className="h-24" />
            </a>
            <ul className="mt-8 space-y-1 text-[15px]">
              <li>
                <a href={phone.href} className="inline-flex min-h-11 items-center gap-3 text-white/80 transition-colors hover:text-white">
                  <Phone aria-hidden="true" className="size-4 text-sky" />
                  {phone.display}
                </a>
              </li>
              <li>
                <a href={email.href} className="inline-flex min-h-11 items-center gap-3 break-all text-white/80 transition-colors hover:text-white">
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-sky" />
                  {email.display}
                </a>
              </li>
              <li>
                <a
                  href={address.directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 text-white/80 transition-colors hover:text-white"
                >
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-sky" />
                  {address.line1} {address.line2}
                  <span className="sr-only"> (opens Google Maps in a new tab)</span>
                </a>
              </li>
            </ul>

            <ul className="mt-6 flex gap-1" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <BrandIcon name={s.icon} className="size-[18px]" />
                    <span className="sr-only">{s.name} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            <Button href={leaveReview.href} variant="ghostLight" target="_blank" rel="noopener noreferrer" className="mt-6">
              {leaveReview.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </Button>
          </div>

          <div className="grid md:grid-cols-4 md:gap-x-8 lg:col-span-8">
            {footerGroups.map((group) => (
              <FooterGroup key={group.heading} heading={group.heading} links={group.links} />
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p suppressHydrationWarning>
            ©{new Date().getFullYear()}, {copyrightName}. All Rights Reserved.
          </p>
          <a href={privacyPolicy.href} className="inline-flex min-h-11 items-center self-start text-white/75 transition-colors hover:text-white md:self-auto">
            {privacyPolicy.label}
          </a>
        </div>
      </Container>
    </footer>
  );
}

function FooterGroup({ heading, links }: { heading: string; links: readonly { label: string; href: string }[] }) {
  // Mobile: accordion. Tablet/desktop: always-open column. (Pre-rendered HTML uses the open layout.)
  const isMdUp = useMediaQuery(MD_UP);
  const [open, setOpen] = useState(false);
  const id = `footer-${heading.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <div className="border-t border-white/10 md:border-0">
      <h2 className="font-display">
        {isMdUp ? (
          <span className="block text-xs font-semibold tracking-[0.16em] text-sky uppercase">{heading}</span>
        ) : (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((v) => !v)}
            className="flex min-h-14 w-full items-center justify-between text-left text-[15px] font-semibold text-white"
          >
            {heading}
            <ChevronDown aria-hidden="true" className={`size-5 text-sky transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </h2>
      <div id={id} data-open={isMdUp || open} className="collapsible">
        <div>
          <ul className="pb-4 md:mt-4 md:pb-0">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex min-h-11 items-center text-[15px] leading-snug text-white/75 transition-colors hover:text-white"
                >
                  <span className="link-draw">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
