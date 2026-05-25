import { Outlet, Link, useLocation } from 'react-router';
import { 
  Home, 
  Lightbulb, 
  Zap, 
  Shield, 
  Users, 
  Bell, 
  BarChart3,
  UtensilsCrossed,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Urządzenia', href: '/devices', icon: Lightbulb },
  { name: 'Automatyzacje', href: '/automations', icon: Zap },
  { name: 'Bezpieczeństwo', href: '/security', icon: Shield },
  { name: 'AGD', href: '/appliances', icon: UtensilsCrossed },
  { name: 'Statystyki', href: '/statistics', icon: BarChart3 },
  { name: 'Użytkownicy', href: '/users', icon: Users },
  { name: 'Powiadomienia', href: '/notifications', icon: Bell },
];

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200">
            <Link to="/">
              <h1 className="text-xl font-bold text-slate-900">SmartHome</h1>
              <p className="text-sm text-slate-600 mt-1">System zarządzania</p>
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full mt-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/">
            <h1 className="text-lg font-bold text-slate-900">SmartHome</h1>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full pt-16">
              <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              
              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full mt-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Wyloguj
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}