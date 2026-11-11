/**
 * Original Anderson Law Firm logo files, unmodified:
 *  - "white": the original lossless PNG (400×377) for dark surfaces (header, footer) — crisp at large sizes.
 *  - "tile":  the original blue-tile logo for light surfaces (mobile menu sheet).
 */
const files = {
  white: { src: '/images/logo-white.png', srcSet: undefined, w: 400, h: 377 },
  tile: { src: '/images/logo-blue-tile-120.webp', srcSet: '/images/logo-blue-tile-120.webp 1x, /images/logo-blue-tile-240.webp 2x', w: 300, h: 283 },
} as const;

export function Logo({ variant, className = '' }: { variant: keyof typeof files; className?: string }) {
  const f = files[variant];
  return (
    <img
      src={f.src}
      srcSet={f.srcSet}
      width={f.w}
      height={f.h}
      alt="Anderson Law Firm, PC"
      decoding="async"
      className={`w-auto ${className}`}
    />
  );
}
