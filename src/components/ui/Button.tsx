import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * CTA hover (all variants): lifts 1px, colour eases over 250ms, the trailing arrow moves 4px.
 * Pressed: settles back down. Disabled entirely under reduced motion.
 */
const variants = {
  /** Primary blue — on light or dark surfaces, with a soft brand-tinted shadow on hover. */
  primary:
    'bg-primary text-white hover:-translate-y-px hover:bg-primary-hover hover:shadow-[0_14px_28px_-14px_rgb(38_115_164/0.9)] active:translate-y-0',
  /** White fill — on navy / photo bands. */
  white: 'bg-white text-navy hover:-translate-y-px hover:bg-mist hover:shadow-[0_14px_28px_-16px_rgb(0_0_0/0.6)] active:translate-y-0',
  /** Outline for dark surfaces. */
  ghostLight: 'border border-white/40 text-white hover:-translate-y-px hover:border-white hover:bg-white/[0.08] active:translate-y-0',
  /** Outline for light surfaces. */
  ghostDark: 'border border-primary text-primary hover:-translate-y-px hover:bg-primary hover:text-white active:translate-y-0',
} as const;

const sizes = {
  /** Matches the 44px navigation items in the header. */
  sm: 'h-11 px-5 text-[15px]',
  /** Tight horizontal padding for side-by-side buttons on narrow phones (e.g. the bottom action bar). */
  compact: 'h-12 px-3.5 text-[14px] min-[360px]:px-4 min-[360px]:text-[15px]',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-7 text-base',
} as const;

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: AsLink | AsButton) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'start',
    fullWidth = false,
    children,
    className = '',
    ...rest
  } = props;

  const classes = [
    'group/btn inline-flex shrink-0 items-center justify-center gap-2.5 rounded-lg font-display font-semibold tracking-[0.01em]',
    // Tailwind 4 moves elements with the `translate` property, so it must be listed for the lift to ease.
    'transition-[background-color,border-color,color,box-shadow,translate] duration-[250ms] ease-brand select-none',
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  const content = (
    <>
      {icon && iconPosition === 'start' && <span aria-hidden="true" className="-ml-0.5 flex">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'end' && (
        <span aria-hidden="true" className="-mr-0.5 flex transition-transform duration-300 ease-brand group-hover/btn:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
