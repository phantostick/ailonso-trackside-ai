import { ReactNode, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import AvatarTTS from './AvatarTTS';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { path: '/', label: 'Ask Alonso', icon: '🏎️' },
  { path: '/trivia', label: 'Green-Light Trivia', icon: '🚦' },
  { path: '/clipit', label: 'CliPIT', icon: '📹' },
  { path: '/simulator', label: 'Racecraft Simulator', icon: '🏁' },
  { path: '/merch', label: 'Style Studio', icon: '👕' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // GSAP hover animations for nav links
    navLinksRef.current.forEach((link) => {
      if (!link) return;
      
      const handleMouseEnter = () => {
        gsap.to(link, {
          scale: 1.05,
          boxShadow: '0 0 20px rgba(10, 185, 139, 0.5)',
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(link, {
          scale: 1,
          boxShadow: '0 0 0px rgba(10, 185, 139, 0)',
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleClick = () => {
        gsap.fromTo(link,
          { scale: 0.95 },
          { scale: 1.05, duration: 0.2, ease: 'power2.out' }
        );
      };

      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
      link.addEventListener('click', handleClick);

      return () => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
        link.removeEventListener('click', handleClick);
      };
    });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/amf1-background.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(30%)',
        }}
      />
      {/* Navigation Bar */}
      <nav className="bg-card/80 border-b border-border px-8 py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* AMF1 Logo */}
          <div className="flex items-center space-x-3">
            <div className="racing-title text-2xl font-bold">AMF1</div>
            <div className="text-accent text-sm font-semibold">Ask Alonso</div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navigationItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                ref={(el) => (navLinksRef.current[index] = el)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    "hover:bg-secondary/80 hover:text-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                      : "text-muted-foreground"
                  )
                }
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden racing-button-secondary">
            Menu
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card/80 border-t border-border py-8 mt-16 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="racing-title text-xl mb-2">AMF1 • Ask Alonso</div>
          <p className="text-muted-foreground text-sm">
            Unofficial fan website • Built with passion for Formula 1
          </p>
        </div>
      </footer>

      {/* AI Avatar - only on non-home pages */}
      {location.pathname !== '/' && <AvatarTTS />}
    </div>
  );
}