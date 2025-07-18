import * as React from 'react'
import { cn } from '@/lib/utils'

/* ---------- Generic Type Helpers ---------- */

type HeadingProps<E extends HTMLElement> = React.HTMLAttributes<E> & {
  className?: string
}

/* ---------- H1 ---------- */
export const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
      className
    )}
    {...props}
  >
    {children}
  </h1>
))
TypographyH1.displayName = 'TypographyH1'

/* ---------- H2 ---------- */
export const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0',
      className
    )}
    {...props}
  >
    {children}
  </h2>
))
TypographyH2.displayName = 'TypographyH2'

/* ---------- H3 ---------- */
export const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'scroll-m-20 text-2xl font-semibold tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
TypographyH3.displayName = 'TypographyH3'

/* ---------- H4 ---------- */
export const TypographyH4 = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      'scroll-m-20 text-xl font-semibold tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </h4>
))
TypographyH4.displayName = 'TypographyH4'

/* ---------- Paragraph ---------- */
export const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
    {...props}
  >
    {children}
  </p>
))
TypographyP.displayName = 'TypographyP'
