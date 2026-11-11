import { Mail, MapPin, Phone } from 'lucide-react';
import { address, email, phone, reachOutLabel } from '../../content/site';
import { Container } from '../ui/Container';

/** Desktop-only contact strip above the header (scrolls away; the header stays). */
export function UtilityBar() {
  const item =
    'inline-flex min-h-11 items-center gap-2 text-white/75 transition-colors duration-150 hover:text-white';
  return (
    <aside aria-label="Contact details" className="on-dark hidden border-b border-white/10 bg-navy text-sm lg:block">
      <Container className="flex h-11 items-center gap-6">
        <div className="flex items-center gap-6">
          <span className="font-display font-semibold tracking-[0.02em] text-white">{reachOutLabel}</span>
          <a href={phone.href} className={item}>
            <Phone aria-hidden="true" className="size-3.5 text-sky" />
            {phone.display}
          </a>
          <a href={email.href} className={item}>
            <Mail aria-hidden="true" className="size-3.5 text-sky" />
            {email.display}
          </a>
          <a href={address.directionsHref} target="_blank" rel="noopener noreferrer" className={item}>
            <MapPin aria-hidden="true" className="size-3.5 text-sky" />
            {address.line1} {address.line2}
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
      </Container>
    </aside>
  );
}
