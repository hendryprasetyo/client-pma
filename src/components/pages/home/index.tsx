'use client'

import { getProjects } from '@/service/Projects'
import { useSearchStore } from '@/stores/Search'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import moment from 'moment'
import { Separator } from '@/components/ui/separator'
import CreateProjectDialog from './CreateProjectDialog'

const Projects = () => {
  const normalize = (s: string) => s.toLowerCase().trim()
  const searchQuery = normalize(useSearchStore(s => s.query))
  const { query } = useSearchStore()

  const { data, isPending } = useQuery({
    queryKey: ['projects', searchQuery],
    queryFn: () =>
      getProjects({
        search: query ?? undefined,
        page: 1,
        limit: 100,
      }),
    staleTime: 5 * 60 * 1000,
  })

  const filteredProjects = data?.data?.filter(project =>
    project.name.toLowerCase().includes(searchQuery)
  )

  return (
    <div className="flex w-full flex-col items-center space-y-6 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900">My Projects</h1>
        <Separator className="max-w-md mx-auto my-4" />
        <CreateProjectDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {isPending
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))
          : filteredProjects?.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <CardContent>
                    <h3 className="text-lg font-bold text-gray-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created at:&nbsp;
                      {moment(project.createdAt).format('DD-MMM-YYYY, HH:mm')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
        {filteredProjects?.length === 0 && !isPending && (
          <div className="col-span-full text-center text-gray-500">
            No projects found.
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
