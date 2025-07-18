import { ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/ui/app-sidebar'
import BreadcrumbLayout from '@/components/layout/BreadcrumbLayout'
import Navbar from '@/components/layout/Navbar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative flex min-h-screen w-full flex-col text-gray-700 antialiased">
        <Navbar />
        <div className="flex flex-col flex-1 p-6 [background:linear-gradient(185deg,_#ffffff_0%,_#ffffff_50%,_#f3f4f6_50%,_#f3f4f6_100%)]">
          <BreadcrumbLayout />
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
