'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuthHydrated, useAuthStore } from '@/stores/Auth'

export const UserAvatar = () => {
  const hydrated = useAuthHydrated()
  const user = useAuthStore(s => s.user)

  const fullName = hydrated && user ? user.name : ''
  const initials =
    hydrated && user
      ? user.name
          .split(' ')
          .slice(0, 2)
          .map(n => n[0])
          .join('')
          .toUpperCase()
      : ''

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium truncate max-w-[8rem] capitalize">
        {fullName}
      </span>
      <div className="relative">
        <Avatar className="h-8 w-8">
          {hydrated && (
            <AvatarImage src="https://github.com/shadcn.png" alt={fullName} />
          )}
          <AvatarFallback>{initials || '??'}</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
      </div>
    </div>
  )
}
