import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { path: '/', label: 'Ask Alonso', icon: '🏎️' },
  { path: '/trivia', label: 'Green-Light Trivia', icon: '🏁' },
  { path: '/clipit', label: 'CliPIT', icon: '📹' },
  { path: '/simulator', label: 'Racing Simulator', icon: '🏆' },
  { path: '/merch', label: 'Custom Merch', icon: '👕' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="bg-card border-b border-border px-8 py-4 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* AMF1 Logo */}
          <div className="flex items-center space-x-3">
            <div className="racing-title text-2xl font-bold">AMF1</div>
            <div className="text-accent text-sm font-semibold">Ai.lonso</div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-secondary/80 hover:text-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
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
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="racing-title text-xl mb-2">AMF1 • Ai.lonso</div>
          <p className="text-muted-foreground text-sm">
            Unofficial fan website • Built with passion for Formula 1
          </p>
        </div>
      </footer>
    </div>
  );
}