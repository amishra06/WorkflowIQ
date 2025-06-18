import React, { useState, useEffect } from 'react';
import { Menu, X, BrainCircuit } from 'lucide-react';
import Button from '../common/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Customers', path: '/customers' },
    { name: 'Resources', path: '/resources' },
  ];

  const isLandingPage = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isLandingPage ? 'bg-white shadow-md py-3' : 'bg-primary-900 py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BrainCircuit size={32} className={isScrolled || !isLandingPage ? 'text-primary-600' : 'text-white'} />
              <span className={`ml-2 text-xl font-bold ${isScrolled || !isLandingPage ? 'text-gray-900' : 'text-white'}`}>
                WorkflowIQ
              </span>
            </Link>
            
            <div className="hidden md:flex ml-10">
              <ul className="flex space-x-8">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`text-sm font-medium hover:text-primary-500 transition-colors ${
                        isScrolled || !isLandingPage ? 'text-gray-600' : 'text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button
                variant={isScrolled || !isLandingPage ? 'outline' : 'ghost'}
                className={!isScrolled && isLandingPage ? 'text-white hover:bg-white/10' : ''}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant={isScrolled || !isLandingPage ? 'primary' : 'ghost'}
                className={!isScrolled && isLandingPage ? 'bg-white text-primary-600 hover:bg-white/90' : ''}
              >
                Start Free Trial
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${
                isScrolled || !isLandingPage ? 'text-gray-900' : 'text-white'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                onClick={() => setIsOpen(false)}
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;