import * as React from 'react'

import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
type Variant = 'primary' | 'success' | 'warning' | 'info' | 'danger'
type StyleVariant = 'outline' | 'underline'

const variantMap: Record<Variant, string> = {
  primary: 'blue',
  success: 'green',
  warning: 'yellow',
  info: 'cyan',
  danger: 'red',
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant // warna dasar
  error?: boolean // override jadi merah
  styleVariant?: StyleVariant
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = 'primary',
      styleVariant = 'outline',
      error,
      ...props
    },
    ref
  ) => {
    const color = error ? variantMap.danger : variantMap[variant]

    const outlineClasses = cn(
      'rounded-md border px-3 py-1',
      `border-${color}-500 focus-visible:ring-${color}-500/50`
    )

    const underlineClasses = cn(
      'border-0 border-b border-b-[1px] px-0 pb-1 rounded-none transition-all',
      `border-b-${color}-500 focus:border-b-${color}-600 focus:border-b-2 focus:border-black`,
      'focus:outline-none'
    )

    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        aria-invalid={error || undefined}
        className={cn(
          'flex h-9 w-full min-w-0 bg-transparent text-base outline-none transition-colors selection:bg-primary selection:text-primary-foreground md:text-sm',
          'placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          styleVariant === 'underline' ? underlineClasses : outlineClasses,
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

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
const activeText: Record<Variant, string> = {
  primary: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  info: 'text-cyan-500',
  danger: 'text-red-500',
}

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  variant?: Variant
  error?: boolean
  isPassword?: boolean
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      label,
      className,
      id,
      type,
      variant = 'primary',
      error,
      isPassword,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const colorKey: Variant = error ? 'danger' : variant
    const [visible, setVisible] = React.useState(false)
    const inputType =
      isPassword && type === 'password' && visible ? 'text' : type
    return (
      <div className="relative w-full">
        <input
          id={inputId}
          ref={ref as React.Ref<HTMLInputElement>}
          placeholder=" "
          type={inputType}
          className={cn(
            'peer w-full rounded-md border px-3 py-2 text-sm placeholder:text-xs',
            isPassword && 'pr-10',
            error
              ? 'border-red-500 focus:border-red-500'
              : activeBorder[colorKey],
            'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            tabIndex={-1}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            {visible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}

        {/* Label */}
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute left-3 -top-2 z-10 bg-background px-1 text-[10px] transition-opacity opacity-0',
            error ? 'text-red-500' : activeText[colorKey],
            'peer-[&:not(:placeholder-shown)]:opacity-100'
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)
InputWithLabel.displayName = 'InputWithLabel'
export { Input, InputWithLabel }
