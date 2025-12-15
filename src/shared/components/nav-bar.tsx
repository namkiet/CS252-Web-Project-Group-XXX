import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { ChevronDown, LogOut, User, Settings, Menu, Home, Map, BookOpen, Users, Phone } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

import { useAuth } from '@/context/auth-context'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/components/ui/hover-card'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet"

import logoImage from '@/assets/images/logo.png'

export function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isHomePage = currentPath === '/';
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isTransparent = isHomePage && !isScrolled;
  const showBackground = !isHomePage || isScrolled;

  const getLinkClass = (path: string, extraClasses = "") => {
    const isActive = currentPath === path;

    const textColor = isTransparent 
      ? 'text-white hover:text-orange-200' 
      : 'text-gray-700 hover:text-orange-500';

    return `text-base transition-colors ${extraClasses} ${
      isActive
        ? 'text-orange-500 font-bold'           
        : textColor
    }`;
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = currentPath === path;
    return `flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
       isActive 
         ? 'bg-orange-50 text-orange-600' 
         : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 h-18 font-navbar transition-all duration-300">
      <div 
        className={`absolute inset-0 bg-white/70 backdrop-blur-md shadow-md transition-transform duration-500 ease-in-out ${
          showBackground ? 'translate-y-0' : '-translate-y-full'
        }`} 
      />

      <div className="relative z-10 flex h-full items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center">
          <img 
            src={logoImage} 
            alt="Local Food Logo"
            className="h-16 md:h-22 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP */}
        <div className="hidden lg:flex items-center space-x-10 mr-28">
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

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              // SignIn
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full border border-transparent hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 group"
                >
                  {/* Avatar Circle */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-all overflow-hidden">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      avatarChar
                    )}
                  </div>
                  
                  {/* User Name */}
                  <div className="flex flex-col items-start">
                    <span className={`text-sm font-bold group-hover:text-orange-600 max-w-[100px] truncate transition-colors ${
                      isTransparent ? 'text-white' : 'text-gray-700'
                    }`}>
                      {displayName}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-all duration-200 ${isUserMenuOpen ? 'rotate-180' : ''} ${
                    isTransparent ? 'text-white' : 'text-gray-400'
                  }`} />
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

                    <button 
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/profile?tab=general');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left"
                    >
                      <Settings size={16} /> Settings
                    </button>

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

        {/* MOBILE */}
        <div className="lg:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isTransparent ? "text-orange-500 hover:bg-white/20" : "text-gray-800 hover:bg-gray-100"}>
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] flex flex-col pt-4 bg-white sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="hidden">Menu</SheetTitle>
                <SheetDescription className="hidden">
                  Mobile Navigation
                </SheetDescription>
              </SheetHeader>

              {/* Mobile User Info */}
              {user && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 rounded-lg mx-1">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                    {user?.avatar_url ? <img src={user.avatar_url} alt={displayName} className="h-full w-full object-cover rounded-full" /> : avatarChar}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-800 truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-1">
                <SheetClose asChild><Link to="/" className={getMobileLinkClass('/')}><Home size={18} /> Home</Link></SheetClose>
                <SheetClose asChild><Link to="/chat" className={getMobileLinkClass('/chat')}><Map size={18} /> Food Tour</Link></SheetClose>
                <SheetClose asChild><Link to="/food-guide" className={getMobileLinkClass('/food-guide')}><BookOpen size={18} /> Food Guide</Link></SheetClose>
                <SheetClose asChild><Link to="/staff" className={getMobileLinkClass('/staff')}><Users size={18} /> Staff</Link></SheetClose>
                <SheetClose asChild>
                  <a href="https://www.facebook.com/na.mkiet42" target="_blank" rel="noopener noreferrer" className={getMobileLinkClass('#')}><Phone size={18} />Contact Us</a>
                </SheetClose>
              </div>

              {/* Mobile Actions */}
              <div className="mt-auto mb-8 flex flex-col gap-2">
                {user ? (
                  <>
                    <SheetClose asChild>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-medium">
                        <User size={18} /> My Profile
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" onClick={handleLogout} className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-6 w-full text-base font-medium">
                        <LogOut size={18} className="mr-2"/> Log Out
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Button className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90 text-white h-12 text-base" asChild>
                        <Link to="/login">Log In</Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}