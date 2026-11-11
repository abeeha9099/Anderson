import { ArrowRight, MapPin } from 'lucide-react';
import { areaGroups, areasIntro } from '../../content/areas';
import { Container } from '../ui/Container';

export function ServiceAreas() {
  return (
    <section id="service-areas" aria-labelledby="areas-heading" className="bg-canvas">
      <Container className="pt-18 pb-18 md:pt-22 md:pb-22 lg:pt-26 lg:pb-26">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4" data-reveal>
            <h2
              id="areas-heading"
              className="font-display text-[2rem] leading-[1.15] font-bold tracking-[-0.01em] text-ink md:text-[2.5rem] lg:text-[2.75rem]"
            >
              {areasIntro.heading}
            </h2>
            <p className="mt-5 text-[17px] leading-[1.7]">{areasIntro.body}</p>
            <a
              href={areasIntro.allAreas.href}
              className="group mt-6 inline-flex min-h-11 items-center gap-2 font-display font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              {areasIntro.allAreas.label}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          <div className="space-y-9 lg:col-span-7 lg:col-start-6" data-reveal data-reveal-delay="80">
            {areaGroups.map((group) => (
              <div key={group.state}>
                <h3 className="border-b border-line/35 pb-3 font-display text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  {group.state}
                </h3>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {group.areas.map((area) => (
                    <li key={area.label}>
                      {area.href ? (
                        <a
                          href={area.href}
                          className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line/50 bg-white px-4 font-display text-[15px] font-medium text-ink transition-[color,border-color,translate,box-shadow] duration-200 ease-out hover:-translate-y-px hover:border-primary hover:text-primary hover:shadow-card"
                        >
                          <MapPin aria-hidden="true" className="size-4 text-primary" />
                          {area.label}
                        </a>
                      ) : (
                        <span className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-dashed border-line/70 px-4 font-display text-[15px] font-medium text-body">
                          <MapPin aria-hidden="true" className="size-4 text-body" />
                          {area.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
