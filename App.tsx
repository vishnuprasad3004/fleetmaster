import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Truck, Users, Fuel, AlertTriangle, 
  PanelLeftClose, PanelLeftOpen, ClipboardList, Activity
} from 'lucide-react';

// Services
// Replaced firebase/auth imports with local service mock imports
import { 
  auth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from './services/firebase';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import DashboardHome from './components/dashboard/DashboardHome';
import AlertsPage from './components/dashboard/AlertsPage';
import FuelCreditPage from './components/dashboard/FuelCreditPage';
import PredictiveMaintenancePage from './components/dashboard/PredictiveMaintenancePage';

import VehicleList from './components/vehicles/VehicleList';
import VehicleDetailView from './components/vehicles/VehicleDetailView';

import DriverList from './components/drivers/DriverList';
import DriverDetailView from './components/drivers/DriverDetailView';

import BookingsPage from './components/bookings/BookingsPage';
import BookingDetailView from './components/bookings/BookingDetailView';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

// Utils & Types
import { User, Vehicle, Driver, Booking } from './types';
import { generateMockVehicles, generateMockDrivers } from './utils/mockData';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [dashboardPage, setDashboardPage] = useState('overview');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
 
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const initAuth = async () => { 
      // @ts-ignore
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { 
        // @ts-ignore
        await signInWithCustomToken(auth, __initial_auth_token); 
      } else { 
        await signInAnonymously(auth); 
      } 
    };
    initAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser: FirebaseUser | null) => { 
      if (!currentUser && user) setUser(null); 
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => { setVehicles(generateMockVehicles()); setDrivers(generateMockDrivers()); }, []);

  const handleLogin = (role: 'owner' | 'manager') => { setUser({ role, name: role === 'owner' ? 'VP Transport' : 'Fleet Manager' }); setCurrentPage('dashboard'); setDashboardPage('overview'); };
  const handleLogout = () => { signOut(auth); setUser(null); setCurrentPage('home'); };
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleViewVehicle = (vehicle: Vehicle) => { setSelectedVehicle(vehicle); setDashboardPage('vehicles'); };

  const renderDashboardContent = () => {
    if (dashboardPage === 'vehicles' && selectedVehicle) return <VehicleDetailView vehicle={selectedVehicle} role={user?.role} onBack={() => setSelectedVehicle(null)} />;
    if (dashboardPage === 'drivers' && selectedDriver) return <DriverDetailView driver={selectedDriver} role={user?.role} onBack={() => setSelectedDriver(null)} />;
    if (dashboardPage === 'bookings' && selectedBooking) return <BookingDetailView booking={selectedBooking} onBack={() => setSelectedBooking(null)} />;

    switch (dashboardPage) {
      case 'overview': return <DashboardHome role={user?.role} vehicles={vehicles} drivers={drivers} setDashboardPage={setDashboardPage} onViewVehicle={handleViewVehicle} />;
      case 'vehicles': return <VehicleList vehicles={vehicles} role={user?.role} onSelect={handleViewVehicle} />;
      case 'drivers': return <DriverList drivers={drivers} role={user?.role} onSelectDriver={setSelectedDriver} />;
      case 'bookings': return <BookingsPage role={user?.role} onSelectBooking={setSelectedBooking} />;
      case 'fuel': return <FuelCreditPage role={user?.role} vehicles={vehicles} onViewVehicle={handleViewVehicle} onBack={() => setDashboardPage('overview')} />;
      case 'predictive': return <PredictiveMaintenancePage vehicles={vehicles} onViewVehicle={handleViewVehicle} onBack={() => setDashboardPage('overview')} />;
      case 'alerts': return <AlertsPage vehicles={vehicles} onViewVehicle={handleViewVehicle} onBack={() => setDashboardPage('overview')} />;
      default: return <DashboardHome role={user?.role} vehicles={vehicles} drivers={drivers} setDashboardPage={setDashboardPage} onViewVehicle={handleViewVehicle} />;
    }
  };

  const renderDashboard = () => (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
             <div className={`flex items-center space-x-3 transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${user?.role === 'manager' ? 'bg-indigo-600' : 'bg-blue-600'}`}>{user?.role === 'owner' ? 'VP' : 'FM'}</div>
                {!isSidebarCollapsed && <div><p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</p><p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p></div>}
             </div>
             {!isSidebarCollapsed && <button onClick={() => setIsSidebarCollapsed(true)} className="text-slate-400 hover:text-blue-500"><PanelLeftClose className="w-5 h-5" /></button>}
          </div>
          {isSidebarCollapsed && <button onClick={() => setIsSidebarCollapsed(false)} className="w-full flex justify-center mb-4 text-slate-400 hover:text-blue-500"><PanelLeftOpen className="w-5 h-5" /></button>}
         
          <div className="space-y-1">
            {[{ id: 'overview', label: 'Dashboard', icon: LayoutDashboard }, { id: 'bookings', label: 'Bookings', icon: ClipboardList }, { id: 'vehicles', label: 'Vehicles', icon: Truck }, { id: 'drivers', label: 'Drivers', icon: Users }].map((item) => (
              <button key={item.id} onClick={() => { setDashboardPage(item.id); setSelectedVehicle(null); setSelectedDriver(null); setSelectedBooking(null); }} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 space-x-3'} py-3 rounded-lg transition ${dashboardPage === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`} title={isSidebarCollapsed ? item.label : ''}><item.icon className="w-5 h-5 flex-shrink-0" /> {!isSidebarCollapsed && <span>{item.label}</span>}</button>
            ))}
            <button onClick={() => setDashboardPage('fuel')} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 space-x-3'} py-3 rounded-lg transition ${dashboardPage === 'fuel' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Fuel className="w-5 h-5 flex-shrink-0" /> {!isSidebarCollapsed && <span>Fuel & Credit</span>}</button>
            <button onClick={() => setDashboardPage('predictive')} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 space-x-3'} py-3 rounded-lg transition ${dashboardPage === 'predictive' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Activity className="w-5 h-5 flex-shrink-0" /> {!isSidebarCollapsed && <span>Pred. Maint.</span>}</button>
            <button onClick={() => setDashboardPage('alerts')} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 space-x-3'} py-3 rounded-lg transition ${dashboardPage === 'alerts' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><AlertTriangle className="w-5 h-5 flex-shrink-0" /> {!isSidebarCollapsed && <span>System Alerts</span>}</button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8"><div className="max-w-6xl mx-auto">{renderDashboardContent()}</div></main>
    </div>
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Navbar setPage={setCurrentPage} isLoggedIn={!!user} role={user?.role} handleLogout={handleLogout} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        {currentPage === 'home' && <HomePage setPage={setCurrentPage} />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage !== 'dashboard' && currentPage !== 'login' && <Footer />}
      </div>
    </div>
  );
}