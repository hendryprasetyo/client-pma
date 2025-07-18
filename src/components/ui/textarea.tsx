'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'success' | 'warning' | 'info' | 'danger'

const activeBorder: Record<Variant, string> = {
  primary:
    'border-blue-500 placeholder-shown:border-gray-300 focus:border-blue-500',
  success:
    'border-green-500 placeholder-shown:border-gray-300 focus:border-green-500',
  warning:
    'border-yellow-500 placeholder-shown:border-gray-300 focus:border-yellow-500',
  info: 'border-cyan-500 placeholder-shown:border-gray-300 focus:border-cyan-500',
  danger:
    'border-red-500 placeholder-shown:border-gray-300 focus:border-red-500',
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: Variant
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'primary', error, ...props }, ref) => {
    const colorKey: Variant = error ? 'danger' : variant

    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-md border px-3 py-2 text-sm placeholder:text-xs',
          error
            ? 'border-red-500 focus:border-red-500'
            : activeBorder[colorKey],
          'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
