'use client'
import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '../ui/sidebar'
import { SearchBox } from './SearchBox'
import { UserAvatar } from './UserAvatar'

const Navbar = () => {
  const pathname = usePathname()

  const isHomePage = pathname === '/'
  return (
    <header className="sticky left-0 right-0 top-0 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex items-center justify-between xl:px-[2rem] p-2">
        <SidebarTrigger />
        {isHomePage && <SearchBox />}
        <div className="ml-auto">
          <UserAvatar />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
