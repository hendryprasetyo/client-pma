import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden [background:linear-gradient(185deg,_#ffffff_0%,_#ffffff_50%,_#f9fafb_50%,_#f3f4f6_100%)]">
      <main className="mx-auto w-full max-w-md space-y-8 px-4 z-10">
        {children}
      </main>
    </div>
  )
}
