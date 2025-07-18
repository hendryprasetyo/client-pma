'use client'

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import React from 'react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const BreadcrumbLayout = () => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const customBreadcrumb = () => {
    const breadcrumbs: { label: string; href: string }[] = []

    // Always push Dashboard
    breadcrumbs.push({ label: 'Dashboard', href: '/' })

    if (segments[0] === 'projects' && segments.length === 2) {
      // Pattern: /projects/[id]
      breadcrumbs.push({
        label: 'Detail Project',
        href: `/${segments[0]}/${segments[1]}`,
      })
    } else if (
      segments[0] === 'projects' &&
      segments.length === 3 &&
      segments[2] === 'settings'
    ) {
      // Pattern: /projects/[id]/settings
      breadcrumbs.push({
        label: 'Detail Project',
        href: `/projects/${segments[1]}`,
      })
      breadcrumbs.push({
        label: 'Settings',
        href: `/projects/${segments[1]}/settings`,
      })
    } else {
      // Default fallback
      segments.forEach((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/')
        breadcrumbs.push({
          label: segment.replace(/-/g, ' '),
          href,
        })
      })
    }

    return breadcrumbs
  }

  const items = customBreadcrumb()

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={item.href}>
              {index !== 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className={cn({
                    'pointer-events-none text-muted-foreground': isLast,
                  })}
                >
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadcrumbLayout
