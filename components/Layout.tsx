
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Plus, Home, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Add Event', path: '/add', icon: Plus },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
            <Calendar className="w-8 h-8" />
            <span>Admission Calendar</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === link.path ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-indigo-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-600 border-t border-indigo-500">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    location.pathname === link.path ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      <footer className="bg-slate-800 text-slate-400 py-8 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">Admission-Calendar Clone &copy; {new Date().getFullYear()}</p>
          <p className="text-sm">Built with React & Tailwind CSS. Persistent local data storage.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
