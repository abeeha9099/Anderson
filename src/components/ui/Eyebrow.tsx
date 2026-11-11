import type { ReactNode } from 'react';

const tones = {
  primary: 'text-primary',
  sky: 'text-sky',
  white: 'text-white',
} as const;

/** Small uppercase label that sits above a heading. Rendered as <p>, never as a heading. No leading dash. */
export function Eyebrow({
  children,
  tone = 'primary',
  className = '',
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <p className={`font-display text-[0.8125rem] leading-4 font-semibold tracking-[0.16em] uppercase ${tones[tone]} ${className}`}>
      {children}
    </p>
  );
}
