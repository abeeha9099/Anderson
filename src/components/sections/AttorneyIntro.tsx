import { ArrowRight, BadgeCheck, Check, GraduationCap, Landmark, Languages, Phone, type LucideIcon } from 'lucide-react';
import { attorney } from '../../content/home';
import { phone } from '../../content/site';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';

const credentialIcons: Record<string, LucideIcon> = {
  Education: GraduationCap,
  License: BadgeCheck,
  Memberships: Landmark,
};

/**
 * Attorney introduction — typographic, no photograph (the attorney's portrait appears once, in the hero).
 * Layout: heading column + text column, then a full-width credentials band.
 */
export function AttorneyIntro() {
  return (
    <section id="attorney" aria-labelledby="attorney-heading" className="bg-canvas">
      <Container className="py-18 md:py-22 lg:py-26 xl:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow>{attorney.eyebrow}</Eyebrow>
            <h2
              id="attorney-heading"
              className="mt-5 font-display text-[2rem] leading-[1.15] font-bold tracking-[-0.01em] text-ink md:text-[2.5rem] lg:text-[3rem] lg:leading-[1.1]"
            >
              {attorney.heading}
            </h2>
            <p className="mt-8 flex gap-3 border-l-2 border-primary py-1 pl-4 text-[15px] leading-snug text-ink">
              <Languages aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              {attorney.languageNote}
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10" data-reveal data-reveal-delay="80">
            <p className="text-[17px] leading-[1.7]">{attorney.intro}</p>
            <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {attorney.focus.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-snug text-ink">
                  <Check aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-primary" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[17px] leading-[1.7]">{attorney.closing}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Button
                href={phone.href}
                size="lg"
                icon={<Phone className="size-5" />}
                aria-label={`${attorney.primaryCta}: call ${phone.display}`}
              >
                {attorney.primaryCta}
              </Button>
              <a
                href={attorney.aboutLink.href}
                aria-label={attorney.aboutLink.accessibleLabel}
                className="group inline-flex min-h-11 items-center justify-center gap-2 font-display font-semibold text-primary transition-colors hover:text-primary-hover sm:justify-start"
              >
                {attorney.aboutLink.label}
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Credentials band (About page facts) */}
        <div className="mt-14 grid border-y border-line/35 md:grid-cols-3 lg:mt-20" data-reveal>
          {attorney.credentials.map((group, i) => {
            const Icon = credentialIcons[group.heading];
            return (
              <div
                key={group.heading}
                className={`py-7 md:py-9 ${i > 0 ? 'border-t border-line/35 md:border-t-0 md:border-l md:pl-8 lg:pl-10' : ''} ${i < 2 ? 'md:pr-8 lg:pr-10' : ''}`}
              >
                <h3 className="flex items-center gap-3 font-display text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  {Icon && <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />}
                  {group.heading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-[15px] leading-snug text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
