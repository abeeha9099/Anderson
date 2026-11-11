import { ArrowLeft, ArrowRight, ExternalLink, Quote } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { featuredReviewName, reviews, reviewsIntro, type Review } from '../../content/reviews';
import { googleListingHref, leaveReview } from '../../content/site';
import { staggerIndex } from '../../hooks/useReveal';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { Stars } from '../ui/icons';

const INITIAL_DESKTOP = 6;
const LONG_REVIEW = 240;

export function Testimonials() {
  const featured = reviews.find((r) => r.name === featuredReviewName) ?? reviews[0];
  const rest = reviews.filter((r) => r !== featured);
  const [showAll, setShowAll] = useState(false);

  // Mobile carousel state
  const listRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const first = list.children[0] as HTMLElement | undefined;
    if (!first) return;
    const step = first.offsetWidth + 16;
    setIndex(Math.min(rest.length - 1, Math.max(0, Math.round(list.scrollLeft / step))));
  }, [rest.length]);

  useEffect(() => {
    const list = listRef.current;
    list?.addEventListener('scroll', onScroll, { passive: true });
    return () => list?.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const go = (dir: 1 | -1) => {
    const list = listRef.current;
    const target = list?.children[Math.min(rest.length - 1, Math.max(0, index + dir))] as HTMLElement | undefined;
    if (!list || !target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left: target.offsetLeft - list.offsetLeft - 20, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="on-dark bg-navy text-white">
      <Container className="py-18 md:py-22 lg:py-26 xl:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div>
            <Eyebrow tone="sky">{reviewsIntro.eyebrow}</Eyebrow>
            <h2
              id="reviews-heading"
              className="mt-5 font-display text-[2rem] leading-[1.15] font-bold tracking-[-0.01em] md:text-[2.5rem] lg:text-[3rem] lg:leading-[1.1]"
            >
              {reviewsIntro.heading}
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={googleListingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 font-display font-semibold text-sky transition-colors hover:text-white"
            >
              <span className="link-draw">Read more reviews on Google</span>
              <ExternalLink aria-hidden="true" className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <Button href={leaveReview.href} variant="ghostLight" target="_blank" rel="noopener noreferrer">
              {leaveReview.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* Featured review */}
          <figure className="min-w-0 lg:col-span-5" data-reveal>
            <div className="lg:sticky lg:top-28">
              <Quote aria-hidden="true" className="size-10 fill-sky/15 text-sky" strokeWidth={1.25} />
              <blockquote className="mt-6 font-display text-[1.5rem] leading-[1.4] font-medium text-white italic md:text-[1.75rem] lg:text-[2rem] lg:leading-[1.35]">
                <p>“{featured.text}”</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-white/15 pt-6">
                <Avatar name={featured.name} large />
                <div>
                  <p className="font-display text-lg font-semibold">{featured.name}</p>
                  <p className="mt-1 flex items-center gap-3">
                    <Stars rating={featured.rating} />
                    <span className="font-display text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                      {featured.source}
                    </span>
                  </p>
                </div>
              </figcaption>
            </div>
          </figure>

          {/* All other reviews: carousel on mobile, two-column list from md up */}
          <div className="min-w-0 lg:col-span-7">
            <ul
              ref={listRef}
              id="review-list"
              aria-label="Client reviews"
              // `relative` makes the list the containing block for sr-only text inside off-screen cards,
              // otherwise those absolutely positioned spans widen the whole document on mobile.
              className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-0 md:overflow-visible md:px-0 md:pb-0"
              data-reveal
              data-reveal-delay="100"
            >
              {rest.map((review, i) => {
                const extra = i >= INITIAL_DESKTOP;
                return (
                <li
                  key={review.name}
                  // Extra reviews (desktop "Show all") rise in sequence when revealed.
                  style={extra && showAll ? staggerIndex(i - INITIAL_DESKTOP) : undefined}
                  className={`w-[86%] shrink-0 snap-start sm:w-[60%] md:w-auto ${extra && !showAll ? 'md:hidden' : ''} ${extra && showAll ? 'reveal-show' : ''}`}
                >
                  <ReviewItem review={review} />
                </li>
                );
              })}
            </ul>

            {/* Mobile carousel controls */}
            <div className="mt-6 flex items-center justify-between md:hidden">
              <p aria-live="polite" className="font-display text-sm font-semibold text-white/60 tabular-nums">
                {index + 1} / {rest.length}
                <span className="sr-only"> reviews</span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={index === 0}
                  aria-controls="review-list"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 disabled:opacity-40"
                >
                  <ArrowLeft aria-hidden="true" className="size-5" />
                  <span className="sr-only">Previous review</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={index === rest.length - 1}
                  aria-controls="review-list"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 disabled:opacity-40"
                >
                  <ArrowRight aria-hidden="true" className="size-5" />
                  <span className="sr-only">Next review</span>
                </button>
              </div>
            </div>

            {rest.length > INITIAL_DESKTOP && (
              <div className="mt-8 hidden border-t border-white/15 pt-8 md:block">
                <Button
                  variant="ghostLight"
                  aria-expanded={showAll}
                  aria-controls="review-list"
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? 'Show fewer reviews' : `Show all reviews (${reviews.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > LONG_REVIEW;
  const id = `review-${review.name.toLowerCase().replace(/\W+/g, '-')}`;

  return (
    <figure className="flex h-full flex-col rounded-md border border-white/12 bg-white/[0.04] p-6 md:rounded-none md:border-0 md:border-t md:border-white/15 md:bg-transparent md:px-0 md:py-8">
      <figcaption className="flex items-center gap-3">
        <Avatar name={review.name} />
        <div className="min-w-0">
          <p className="truncate font-display font-semibold text-white">{review.name}</p>
          <p className="flex items-center gap-2.5">
            <Stars rating={review.rating} />
            <span className="font-display text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
              {review.source}
            </span>
          </p>
        </div>
      </figcaption>
      <blockquote className="mt-4 flex-1">
        <p id={id} className={`text-[16px] leading-[1.7] text-white/75 ${long && !expanded ? 'line-clamp-6' : ''}`}>
          {review.text}
        </p>
      </blockquote>
      {long && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 inline-flex min-h-11 items-center self-start font-display text-sm font-semibold text-sky transition-colors hover:text-white"
        >
          {expanded ? 'Show less' : 'Read full review'}
          <span className="sr-only"> from {review.name}</span>
        </button>
      )}
    </figure>
  );
}

/** Initial-letter avatar, as on the live site (no photos exist for reviewers). */
function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-display font-semibold text-white ${
        large ? 'size-14 text-xl' : 'size-11 text-base'
      }`}
    >
      {name.charAt(0)}
    </span>
  );
}
