import FormLogin from '@/components/pages/login/FormLogin'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Project Management App',
  description: 'Masuk ke akun Anda untuk mengakses fitur dan data.',
  robots: 'index, follow',
  openGraph: {
    title: 'Login | Project Management App',
    description: 'Masuk ke akun Anda untuk mengakses fitur dan data.',
    url: 'https://client-pma.vercel.app/login',
    siteName: 'Project Management App',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login | Project Management App',
    description: 'Masuk ke akun Anda untuk mengakses fitur dan data.',
  },
}

export default function LoginPage() {
  return <FormLogin />
}
