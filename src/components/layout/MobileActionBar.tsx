import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { hero } from '../../content/home';
import { callNowLabel } from '../../content/navigation';
import { phone } from '../../content/site';
import { Button } from '../ui/Button';

/**
 * Phone-only (< 768px) action bar, fixed to the bottom of the screen for the whole page.
 * It slides away (and becomes inert) while a form field is focused, so it never covers what
 * the visitor is typing or traps focus off-screen.
 */
export function MobileActionBar() {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement && t.matches('input:not([type="submit"]), textarea, select');
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = (e: FocusEvent) => isField(e.target) && !isField(e.relatedTarget) && setTyping(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  return (
    <aside
      aria-label="Quick contact"
      inert={typing}
      className={`on-dark animate-bar fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_-18px_rgb(17_18_64/0.9)] transition-transform duration-300 ease-out md:hidden ${
        typing ? 'translate-y-full' : ''
      }`}
    >
      {/* Call takes its natural width; the message button fills the rest (fits down to 320px screens). */}
      <div className="mx-auto grid max-w-md grid-cols-[auto_1fr] gap-2.5">
        <Button
          href={phone.href}
          size="compact"
          aria-label={`${callNowLabel}, ${phone.display}`}
          icon={<Phone className="size-[18px]" />}
          className="whitespace-nowrap"
        >
          {callNowLabel}
        </Button>
        <Button href="#contact" size="compact" variant="white" className="whitespace-nowrap">
          {hero.primaryCta}
        </Button>
      </div>
    </aside>
  );
}
