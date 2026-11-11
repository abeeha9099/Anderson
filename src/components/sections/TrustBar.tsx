import { badges, trustFacts } from '../../content/home';
import { Container } from '../ui/Container';

export function TrustBar() {
  return (
    <section aria-labelledby="trust-heading" className="relative bg-canvas">
      <h2 id="trust-heading" className="sr-only">
        Affiliations &amp; Reviews
      </h2>
      <Container className="pt-12 pb-14 md:pt-14 lg:pt-16 lg:pb-16">
        <ul data-reveal className="grid gap-y-5 sm:grid-cols-3 sm:divide-x sm:divide-line/40">
          {trustFacts.map((fact) => (
            <li key={fact.year} className="flex items-end gap-5 sm:block sm:px-6 sm:first:pl-0 lg:px-10">
              <p className="w-[5.5rem] shrink-0 sm:w-auto">
                <span className="block font-display text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  Since
                </span>
                <span className="block font-display text-[2.25rem] leading-tight font-bold tracking-[-0.01em] text-navy tabular-nums lg:text-[2.75rem]">
                  {fact.year}
                </span>
              </p>
              <p className="pb-1.5 text-[15px] leading-snug text-body sm:mt-1 sm:pb-0">{fact.label}</p>
            </li>
          ))}
        </ul>

        <ul
          data-reveal
          data-reveal-delay="120"
          className="mt-10 grid grid-cols-3 items-center gap-x-4 gap-y-4 border-t border-line/30 pt-8 sm:grid-cols-4 lg:mt-12 lg:grid-cols-7 lg:pt-10"
        >
          {badges.map((badge) => {
            const img = (
              <img
                src={`/images/${badge.image}`}
                width={badge.w / 2}
                height={badge.h / 2}
                alt={badge.name}
                loading="lazy"
                decoding="async"
                className="h-auto max-h-10 w-auto max-w-full object-contain sm:max-w-[8.5rem] lg:max-h-12 transition duration-300 md:opacity-70 md:grayscale md:group-hover:opacity-100 md:group-hover:grayscale-0 md:group-focus-visible:opacity-100 md:group-focus-visible:grayscale-0"
              />
            );
            return (
              <li key={badge.name} className="flex justify-center">
                {badge.href ? (
                  <a
                    href={badge.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-16 w-full items-center justify-center rounded-sm px-2"
                  >
                    {img}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="group flex min-h-16 w-full items-center justify-center px-2">{img}</span>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
