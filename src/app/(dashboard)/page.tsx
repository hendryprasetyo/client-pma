import { getQueryClient } from '@/app/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getProjects } from '@/service/Projects'
import Projects from '@/components/pages/home'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Management App',
  description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
  openGraph: {
    title: 'Project Management App',
    description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
    url: 'https://client-pma.vercel.app/',
    siteName: 'Nama Aplikasi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Management App',
    description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
  },
  robots: 'index, follow',
  // canonical:
  alternates: { canonical: 'https://client-pma.vercel.app/' },
}

export default async function HomePage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Projects />
    </HydrationBoundary>
  )
}
