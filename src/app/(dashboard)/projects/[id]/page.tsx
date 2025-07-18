import { getQueryClient } from '@/app/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getDetailProject } from '@/service/Projects'
import { Metadata } from 'next'
import DetailProject from '@/components/pages/DetailProjects'

export const metadata: Metadata = {
  title: 'Details | Project Management App',
  description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
  openGraph: {
    title: 'Details | Project Management App',
    description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
    url: 'https://client-pma.vercel.app/',
    siteName: 'Nama Aplikasi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Details | Project Management App',
    description: 'Kelola Project anda lebih mudah dan efisien dengan PMA',
  },
  robots: 'index, follow',
  // canonical:
  alternates: { canonical: 'https://pma.vercel.app/' },
}

export default async function DetailProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['projects', id],
    queryFn: () => getDetailProject(id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailProject projectId={id} />
    </HydrationBoundary>
  )
}
