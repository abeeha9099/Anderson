import { ArrowRight, Clock, Languages, Phone } from 'lucide-react';
import { useEffect, useRef, type CSSProperties } from 'react';
import { hero } from '../../content/home';
import { callNowLabel } from '../../content/navigation';
import { businessHours, phone, spanishNote } from '../../content/site';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/** Weekday hours, as listed in the contact section (Sat/Sun are shown there in full). */
const weekdayHours = businessHours.slice(0, 2).map((h) => `${h.day} ${h.hours}`);

/** Mask that dissolves the lower legs and the arch base into the navy background. */
const fadeMask = {
  maskImage: 'linear-gradient(to bottom, #000 70%, transparent 98%)',
  WebkitMaskImage: 'linear-gradient(to bottom, #000 70%, transparent 98%)',
} as CSSProperties;

export function Hero() {
  // Pause the slow background drift whenever the hero is off screen (saves work on phones).
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.removeAttribute('data-motion-paused');
      else el.setAttribute('data-motion-paused', '');
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="top" aria-labelledby="hero-heading" className="on-dark relative z-10 isolate overflow-hidden bg-navy text-white">
      {/* Background: the original archway photo, very faint, and masked so it only appears on the
          portrait side — it never sits behind the text. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src="/images/archway-1600.webp"
          srcSet="/images/archway-960.webp 960w, /images/archway-1600.webp 1600w"
          sizes="100vw"
          alt=""
          fetchPriority="low"
          decoding="async"
          className="h-full w-full object-cover object-[70%_center] opacity-[0.06] mix-blend-luminosity [mask-image:linear-gradient(to_top,#000_12%,transparent_45%)] lg:[mask-image:linear-gradient(to_left,#000_20%,transparent_62%)]"
        />
        {/* Soft light behind the portrait so the black dress separates from the navy. Brand primary only.
            It drifts very slowly (10s, alternating) — the only looping motion on the page.
            Stacked layouts: low and centred (behind the portrait). Desktop: right side. */}
        <div className="hero-ambient absolute inset-0 bg-[radial-gradient(75%_32%_at_50%_86%,rgb(38_115_164/0.32),transparent_75%)] lg:left-auto lg:w-[70%] lg:bg-[radial-gradient(52%_60%_at_78%_58%,rgb(38_115_164/0.34),transparent_72%)]" />
      </div>

      {/* Phones/tablets: copy, then a centred portrait. Desktop (≥1024px): side by side, vertically centred. */}
      <Container className="grid grid-cols-1 items-center gap-y-12 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-x-12 lg:pt-12">
        {/* Copy */}
        <div className="lg:col-span-6 lg:py-14">
          <Eyebrow tone="sky" className="animate-rise">
            {hero.eyebrow}
          </Eyebrow>
          <h1
            id="hero-heading"
            style={delay(90)}
            className="animate-rise mt-5 max-w-[16ch] font-display text-[2.375rem] leading-[1.06] font-bold tracking-[-0.02em] text-white sm:text-[3rem] lg:text-[3.375rem] lg:leading-[1.04] xl:text-[3.75rem]"
          >
            {hero.heading}
          </h1>
          <p
            style={delay(220)}
            className="animate-rise mt-6 max-w-[37rem] text-[17px] leading-[1.7] text-white/75 lg:text-[18px]"
          >
            {hero.lead}
          </p>

          {/* Both contact actions. On phones the same two actions live in the sticky bottom bar. */}
          <div style={delay(340)} className="animate-rise mt-9 hidden flex-wrap gap-3 md:flex">
            <Button href="#contact" size="lg" icon={<ArrowRight className="size-5" />} iconPosition="end">
              {hero.primaryCta}
            </Button>
            <Button
              href={phone.href}
              size="lg"
              variant="ghostLight"
              icon={<Phone className="size-5" />}
              aria-label={`${callNowLabel}, ${phone.display}`}
            >
              {callNowLabel} <span className="font-medium tabular-nums text-white/70">{phone.display}</span>
            </Button>
          </div>

          {/* Reassurance next to the actions: when the office answers, and language support. */}
          <ul
            style={delay(440)}
            className="animate-rise mt-7 flex flex-col gap-2.5 border-t border-white/10 pt-5 text-[14.5px] leading-snug text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-7"
          >
            <li className="flex items-start gap-2.5">
              <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky" />
              {/* Each range stays on one line; ranges wrap as whole units on narrow screens. */}
              <span className="flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:gap-x-2">
                {weekdayHours.map((h, i) => (
                  <span key={h} className="whitespace-nowrap">
                    {i > 0 && <span aria-hidden="true" className="mr-2 hidden text-white/40 sm:inline">·</span>}
                    {h}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Languages aria-hidden="true" className="size-4 shrink-0 text-sky" />
              <span>{spanishNote}</span>
            </li>
          </ul>
        </div>

        {/* Portrait: the client's photo with the office wall removed (assets/derived/README.md).
            Below 1024px: head to waist, caption underneath. Desktop: head to mid-calf, fading into the navy,
            sized so its height matches the copy block (≈ 620–680px). */}
        <figure className="relative mx-auto w-full max-w-[20rem] self-end sm:max-w-[23rem] lg:col-span-5 lg:col-start-8 lg:max-w-[20.5rem] lg:justify-self-center xl:max-w-[22rem]">
          <div className="relative">
            {/* Arch panel (echoes the original archway and the logo's "A"); the head breaks above it. */}
            <div aria-hidden="true" className="animate-arch absolute inset-x-[5%] top-[13%] bottom-0" style={fadeMask}>
              <div className="h-full w-full rounded-t-full bg-[linear-gradient(to_bottom,rgb(38_115_164/0.55),rgb(38_115_164/0.18))] ring-1 ring-sky/25 ring-inset" />
            </div>
            <div aria-hidden="true" className="animate-arch absolute -inset-x-[1%] top-[8%] bottom-0 rounded-t-full border border-b-0 border-sky/20" style={fadeMask} />

            <div className="relative overflow-hidden max-lg:aspect-[4/5]" style={fadeMask}>
              <img
                src="/images/portrait-cutout-620.webp"
                srcSet="/images/portrait-cutout-400.webp 400w, /images/portrait-cutout-620.webp 620w"
                sizes="(min-width: 1280px) 352px, (min-width: 1024px) 328px, 368px"
                width={620}
                height={1160}
                alt={hero.portraitAlt}
                fetchPriority="high"
                className="animate-figure relative block h-auto w-full max-lg:h-full max-lg:object-cover max-lg:object-top"
              />
            </div>
          </div>

          {/* Never overlaps the person: below the photo on small screens; over the fully faded base on desktop. */}
          <figcaption
            style={delay(950)}
            className="animate-rise mx-auto mt-2 mb-10 w-max max-w-full rounded-lg bg-navy/85 px-5 py-3 text-center ring-1 ring-white/12 backdrop-blur-sm lg:absolute lg:bottom-4 lg:left-1/2 lg:mt-0 lg:mb-0 lg:max-w-[95%] lg:-translate-x-1/2"
          >
            <span className="block font-display text-[15px] font-semibold tracking-[0.01em] text-white">{hero.caption.name}</span>
            <span className="mt-0.5 block text-[13px] leading-snug text-white/65">{hero.caption.detail}</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
