import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ContainerProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/** Page container: 1240px content width, 20 / 32 / 40px side padding. */
export function Container<T extends ElementType = 'div'>({ as, className = '', ...rest }: ContainerProps<T>) {
  const Tag = as ?? 'div';
  return <Tag className={`mx-auto w-full max-w-[1320px] px-5 md:px-8 xl:px-10 ${className}`} {...rest} />;
}
