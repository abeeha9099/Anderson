import { whyChoose } from '../../content/home';
import { staggerIndex } from '../../hooks/useReveal';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';

/** Live-site sections 5 and 6 merged. All text is 100% white on primary (85% white fails contrast). */
export function WhyChoose() {
  return (
    <section id="why-choose" aria-labelledby="why-heading" className="on-dark relative bg-primary text-white">
      {/* Phones/tablets: a wide banner centred on the gavel (landscape source, sized to the screen width). */}
      <div
        aria-hidden="true"
        className="duotone aspect-[16/9] w-full sm:aspect-[21/9] lg:hidden"
        style={{ ['--duotone-depth' as string]: 0.6, ['--duotone-tint' as string]: 'var(--color-primary-hover)' }}
      >
        <img
          src="/images/gavel-meeting-960.webp"
          srcSet="/images/gavel-meeting-640.webp 640w, /images/gavel-meeting-960.webp 960w, /images/gavel-meeting-1280.webp 1280w"
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[50%_66%]"
        />
      </div>

      <Container className="relative py-16 md:py-22 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:py-26 xl:gap-x-16 xl:py-32">
        {/* Desktop: a framed 4:5 crop (whole gavel + block in view) that stays in view while reading. */}
        <div className="hidden lg:col-span-5 lg:block">
          <div
            aria-hidden="true"
            className="duotone sticky top-32 aspect-[4/5] w-full rounded-sm shadow-panel ring-1 ring-white/15"
            style={{ ['--duotone-depth' as string]: 0.6, ['--duotone-tint' as string]: 'var(--color-primary-hover)' }}
          >
            <img
              src="/images/gavel-portrait-820.webp"
              srcSet="/images/gavel-portrait-560.webp 560w, /images/gavel-portrait-820.webp 820w, /images/gavel-portrait-1024.webp 1024w"
              sizes="(min-width: 1280px) 460px, 380px"
              width={1024}
              height={1280}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div data-reveal>
            <Eyebrow tone="white">{whyChoose.eyebrow}</Eyebrow>
            <h2
              id="why-heading"
              className="mt-5 max-w-[22ch] font-display text-[2rem] leading-[1.15] font-bold tracking-[-0.01em] text-white md:text-[2.5rem] lg:text-[2.75rem] lg:leading-[1.12]"
            >
              {whyChoose.heading}
            </h2>
          </div>

          {/* The three points fade up in order (a quiet sequence that follows the reading order). */}
          <ol className="mt-10 lg:mt-14" data-reveal="stagger" style={{ ['--reveal-step' as string]: '110ms' }}>
            {whyChoose.pillars.map((pillar, i) => (
              <li
                key={pillar.title}
                style={staggerIndex(i)}
                className="grid gap-x-8 gap-y-3 border-t border-white/30 py-8 first:pt-8 last:pb-0 sm:grid-cols-[4.5rem_1fr]"
              >
                {/* Navy numerals: large bold text on primary = 3.44:1 (passes the 3:1 large-text rule). */}
                <span aria-hidden="true" className="font-display text-[2.5rem] leading-none font-bold text-navy tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  {'label' in pillar && (
                    <p className="mb-2 font-display text-xs font-semibold tracking-[0.16em] text-white uppercase">
                      {pillar.label}
                    </p>
                  )}
                  <h3 className="font-display text-[1.375rem] leading-[1.25] font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-3 max-w-[62ch] text-[16.5px] leading-[1.7] text-white">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
