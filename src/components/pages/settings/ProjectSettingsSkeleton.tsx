'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

const ProjectSettingsSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <Skeleton className="h-8 w-1/3" />

      {/* Project name input */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full max-w-md" />
      </div>

      <Separator />

      {/* Members */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 border rounded-xl bg-muted/50"
            >
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="text-right">
        <Skeleton className="h-10 w-32 ml-auto" />
      </div>
    </div>
  )
}

export default ProjectSettingsSkeleton
