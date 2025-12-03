import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

import { useAuth } from '@/context/auth-context'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/components/ui/hover-card'

import logoImage from '@/assets/images/logo.png'

export function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const displayName = user?.full_name || user?.email || 'User';
  const avatarChar = displayName.charAt(0).toUpperCase();

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
      <Link to="/" className="flex items-center">
        <img 
          src={logoImage} 
          alt="Local Food Logo" 
          className="h-22 w-auto object-contain"
        />
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
          <Link to="/food-guide" className={getLinkClass('/food-guide')}>
            Food Guide
          </Link>
          <Link to="/staff" className={getLinkClass('/staff')}>
            Staff
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
          {user ? (
            // SignIn
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full border border-transparent hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 group"
              >
                {/* Avatar Circle */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all">
                  {avatarChar}
                </div>
                
                {/* User Name */}
                <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 max-w-[100px] truncate">
                        {displayName}
                    </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800 truncate" title={user.email}>{user.email}</p>
                  </div>

                  <Link 
                    to="/profile" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <User size={16} /> My Profile
                  </Link>

                  <Link 
                    to="/settings" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <Settings size={16} /> Settings
                  </Link>

                  <div className="h-px bg-gray-100 my-1 mx-2"></div>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Not SignIn
            <Button variant="outline" asChild
              className="
              text-lg font-semibold rounded-full
              border-[var(--color-brand)]
              text-[var(--color-brand)]
              hover:bg-[var(--color-brand)]/10
              ">
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    
    </nav>
  )
}