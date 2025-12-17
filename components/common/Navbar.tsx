import React from 'react';
import { Truck, LogOut, Moon, Sun, Menu, X } from 'lucide-react';

interface NavbarProps {
  setPage: (page: string) => void;
  isLoggedIn: boolean;
  role?: string;
  handleLogout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  setPage, isLoggedIn, role, handleLogout, isMobileMenuOpen, setIsMobileMenuOpen, isDarkMode, toggleTheme 
}) => (
  <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
          <Truck className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-slate-800 dark:text-white">FleetMaster<span className="text-blue-600">Pro</span></span>
        </div>
       
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {!isLoggedIn ? (
            <>
              <button onClick={() => setPage('home')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition">Home</button>
              <button onClick={() => setPage('services')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition">Services</button>
              <button onClick={() => setPage('about')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition">About</button>
              <button onClick={() => setPage('contact')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition">Contact</button>
              <button
                onClick={() => setPage('login')}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
              >
                Login Portal
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border uppercase tracking-wide ${role === 'manager' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200'}`}>
                {role === 'manager' ? 'Manager Ops' : 'Owner View'}
              </span>
              <button onClick={handleLogout} className="flex items-center text-slate-600 dark:text-slate-300 hover:text-red-600 transition">
                <LogOut className="h-5 w-5 mr-1" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
           <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;