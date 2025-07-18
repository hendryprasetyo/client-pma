'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from './badge'
import { usePathname, useRouter } from 'next/navigation'
import { MenuListAdminDashboard } from '@/lib/constants'
import { Button } from './button'
import { Loader2, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/Auth'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { logout } from '@/service/Auth'
import { toast } from 'sonner'
import { TResponseApi } from '@/types/type'
import { useMutation } from '@tanstack/react-query'

const AppSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const { mutate: mutateLogin, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      useAuthStore.getState().logout()
      if (process.env.NODE_ENV !== 'production') {
        document.cookie = '__access_token__=; Max-Age=0; Path=/'
      }
      router.replace('/login')
    },
    onError: (err: { response: { data: TResponseApi<null> } }) => {
      toast.error(err.response?.data?.message ?? 'Login failed')
    },
  })

  return (
    <Sidebar>
      <div className="flex flex-col h-full space-y-4 p-2 w-full">
        <SidebarHeader>
          <Link
            href="/"
            aria-label="Home"
            className="flex w-full items-center justify-start gap-2"
          >
            <div className="relative h-[32px] w-[32px] bg-black rounded-full">
              <Image
                alt="Logo"
                height={32}
                width={32}
                src="/vercel.svg"
                loading="eager"
              />
            </div>
            <h2 className="text-3xl font-extrabold">PMA</h2>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {MenuListAdminDashboard.map(menu => (
            <SidebarMenuItem className="list-none" key={menu.id}>
              <SidebarGroupLabel suppressHydrationWarning>
                {menu.transify_key}
              </SidebarGroupLabel>
              {menu.sub_menu_list.map(subMenu => {
                const isActive = pathname === subMenu.cta
                return (
                  <SidebarMenuSub key={subMenu.id}>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={subMenu.cta}
                          className={cn(
                            'block rounded-lg px-2 py-4 transition-all',
                            isActive
                              ? 'bg-neutral-100 font-semibold'
                              : 'hover:bg-neutral-100/90'
                          )}
                        >
                          <span>{subMenu.transify_key}</span>
                          {subMenu.is_new && (
                            <Badge variant="default">New</Badge>
                          )}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )
              })}
            </SidebarMenuItem>
          ))}
        </SidebarContent>

        {/* Logout Button with Confirmation Dialog */}
        <div className="mt-auto px-2">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logout Confirmation</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to logout?</p>
              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowDialog(false)
                    mutateLogin()
                  }}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Sidebar>
  )
}

export default AppSidebar
