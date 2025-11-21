import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { ChevronDown } from 'lucide-react'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/components/ui/hover-card'

export function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const getLinkClass = (path: string, extraClasses = "") => {
    const isActive = currentPath === path;

    return `text-base transition-colors ${extraClasses} ${
      isActive
        ? 'text-orange-500 font-bold'           
        : 'text-gray-700 hover:text-orange-500' 
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 flex h-18 items-center justify-between bg-white px-8 shadow-md font-navbar">
      <Link to="/" className="text-3xl font-bold text-orange-500">
        Local Food
      </Link>

      {/* Link and Login Button */}
      <div className="flex items-center space-x-10 mr-28">
        <div className="hidden space-x-9 md:flex items-center">
          <Link to="/" className={getLinkClass('/')}>
            Home
          </Link>
          <Link to="/chat" className={getLinkClass('/chat')}>
            Food Tour
          </Link>
          <Link to="/" className={getLinkClass('/staff')}>
            Staff
          </Link>
          <Link to="/" className={getLinkClass('/about')}>
            About Us
          </Link>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link to="#" className={getLinkClass('/contact', 'flex items-center cursor-pointer')}>
                Contact Us
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
            </HoverCardTrigger>

            <HoverCardContent className='w-auto py-3 px-12 border border-[var(--color-brand)]' sideOffset={15}>
              <a 
                href="https://www.facebook.com/na.mkiet42"
                target="_blank"
                rel="noopener noreferrer"
                className="block cursor-pointer text-base rounded-md hover:text-[var(--color-brand)]"
              >
                Facebook
              </a>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild
            className="
            text-lg font-semibold rounded-full
            border-[var(--color-brand)]
            text-[var(--color-brand)]
            hover:bg-[var(--color-brand)]/10
            ">
            <Link to="#">Log in</Link>
          </Button>
        </div>
      </div>
    
    </nav>
  )
}