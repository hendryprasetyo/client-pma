import FormRegister from '@/components/pages/register/FormRegister'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Daftar | Project Management App',
  description: 'Buat akun baru untuk mulai menggunakan layanan kami.',
  robots: 'index, follow',
  openGraph: {
    title: 'Daftar | Project Management App',
    description: 'Buat akun baru untuk mulai menggunakan layanan kami.',
    url: 'https://client-pma.vercel.app/register',
    siteName: 'Project Management App',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daftar | Project Management App',
    description: 'Buat akun baru untuk mulai menggunakan layanan kami.',
  },
}
export default function RegisterPage() {
  return <FormRegister />
}
