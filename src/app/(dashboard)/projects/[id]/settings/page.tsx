import { Metadata } from 'next'
import ProjectSettings from '@/components/pages/settings'

export const metadata: Metadata = {
  title: 'Settings | Project Management App',
  description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
  openGraph: {
    title: 'Settings | Project Management App',
    description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
    url: 'https://client-pma.vercel.app/',
    siteName: 'Nama Aplikasi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settings | Project Management App',
    description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
  },
  robots: 'index, follow',
  // canonical:
  alternates: { canonical: 'https://pma.vercel.app/' },
}

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
      <ProjectSettings projectId={id}/> 
  )
}
