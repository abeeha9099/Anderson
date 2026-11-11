import { ArrowRight, Clock, Languages, Mail, MapPin, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { contactInfo, ctaBand, formIntro } from '../../content/contact';
import { address, businessHours, email, phone, reachOutLabel, spanishNote } from '../../content/site';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { ContactForm } from './ContactForm';

/** Live-site sections 7, 9, 10 and 11 unified: a call band, then one panel with details + form. */
export function ContactSection() {
  return (
    <>
      <section aria-labelledby="cta-heading" className="on-dark relative isolate bg-navy text-white">
        {/* Deep duotone so white text keeps strong contrast over the photo. */}
        <div aria-hidden="true" className="duotone absolute inset-0 -z-10" style={{ ['--duotone-depth' as string]: 0.82 }}>
          <img
            src="/images/gavel-books-1600.webp"
            srcSet="/images/gavel-books-960.webp 960w, /images/gavel-books-1600.webp 1600w"
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[65%_center] opacity-60"
          />
        </div>
        <Container className="grid gap-10 pt-16 pb-36 md:pt-20 md:pb-40 lg:grid-cols-12 lg:items-end lg:pt-24 lg:pb-48">
          <div className="lg:col-span-7" data-reveal>
            <h2
              id="cta-heading"
              className="font-display text-[2rem] leading-[1.15] font-bold tracking-[-0.01em] md:text-[2.5rem] lg:text-[3rem] lg:leading-[1.1]"
            >
              {ctaBand.heading}
            </h2>
            <p className="mt-5 max-w-[38rem] text-[17px] leading-[1.7] text-white/80">{ctaBand.body}</p>
            <Button
              href={phone.href}
              variant="white"
              size="lg"
              icon={<ArrowRight className="size-5" />}
              iconPosition="end"
              aria-label={`${ctaBand.cta}: call ${phone.display}`}
              className="mt-8 w-full sm:w-auto"
            >
              {ctaBand.cta}
            </Button>
          </div>
          <div className="hidden lg:col-span-5 lg:block lg:text-right">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-sky uppercase">{reachOutLabel}</p>
            <a
              href={phone.href}
              className="mt-2 inline-block font-display text-[2.75rem] leading-none font-semibold tracking-[-0.01em] text-white tabular-nums transition-colors hover:text-sky xl:text-5xl"
            >
              {phone.display}
            </a>
          </div>
        </Container>
      </section>

      <section id="contact" aria-labelledby="contact-heading" className="relative z-10 -mt-24 md:-mt-28 lg:-mt-36">
        <Container>
          <div className="grid overflow-hidden rounded-md bg-white shadow-panel ring-1 ring-navy/5 lg:grid-cols-12" data-reveal data-reveal-delay="100">
            {/* Details */}
            <div className="on-dark bg-navy p-7 text-white sm:p-10 lg:col-span-5 lg:p-12">
              <Eyebrow tone="sky">{contactInfo.eyebrow}</Eyebrow>
              <h2 id="contact-heading" className="mt-5 font-display text-[2rem] leading-[1.15] font-bold tracking-[-0.01em] lg:text-[2.25rem]">
                {contactInfo.heading}
              </h2>
              {contactInfo.body.map((p) => (
                <p key={p.slice(0, 20)} className="mt-4 text-[16px] leading-[1.7] text-white/75">
                  {p}
                </p>
              ))}

              <ul className="mt-8 border-b border-white/12">
                <InfoRow icon={<Phone className="size-[18px]" />} heading={contactInfo.phone.label} note={contactInfo.phone.note}>
                  <a href={phone.href} className="inline-flex min-h-11 items-center font-display text-xl font-semibold text-white tabular-nums transition-colors hover:text-sky">
                    {phone.display}
                  </a>
                </InfoRow>
                <InfoRow icon={<Mail className="size-[18px]" />} heading={contactInfo.email.label} note={contactInfo.email.note}>
                  <a href={email.href} className="inline-flex min-h-11 items-center font-display text-[16px] font-semibold break-all text-white transition-colors hover:text-sky">
                    {email.display}
                  </a>
                </InfoRow>
                <InfoRow icon={<MapPin className="size-[18px]" />} heading="Address" headingHidden>
                  <a
                    href={address.directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 flex-col justify-center font-display text-[16px] leading-snug font-semibold text-white transition-colors hover:text-sky"
                  >
                    <span>{address.line1}</span>
                    <span>{address.line2}</span>
                    <span className="sr-only"> (opens Google Maps in a new tab)</span>
                  </a>
                </InfoRow>
                <InfoRow icon={<Clock className="size-[18px]" />} heading={contactInfo.hoursLabel}>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px] leading-snug">
                    {businessHours.map((row) => (
                      <div key={row.day} className="contents">
                        <dt className="font-display font-semibold text-white">{row.day}</dt>
                        <dd className="text-white/75">{row.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </InfoRow>
              </ul>

              <p className="mt-6 flex items-center gap-2.5 text-[15px] text-white/75">
                <Languages aria-hidden="true" className="size-4 text-sky" />
                {spanishNote}
              </p>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
              <Eyebrow>{formIntro.eyebrow}</Eyebrow>
              <h2 id="form-heading" className="mt-5 font-display text-[1.75rem] leading-[1.2] font-bold tracking-[-0.01em] text-ink lg:text-[2.25rem]">
                {formIntro.heading}
              </h2>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function InfoRow({
  icon,
  heading,
  headingHidden = false,
  note,
  children,
}: {
  icon: ReactNode;
  heading: string;
  headingHidden?: boolean;
  note?: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-4 border-t border-white/12 py-5">
      <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-sky">
        {icon}
      </span>
      <div className="min-w-0 pt-0.5">
        <h3 className={headingHidden ? 'sr-only' : 'font-display text-[15px] font-semibold text-white'}>{heading}</h3>
        {note && <p className="mt-0.5 text-sm text-white/60">{note}</p>}
        {children}
      </div>
    </li>
  );
}
