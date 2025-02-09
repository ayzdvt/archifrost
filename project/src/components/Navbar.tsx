import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial user state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo className="h-10 w-auto" variant="dark" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-navy-900 px-3 py-2">Ana Sayfa</Link>
            <Link to="/about" className="text-gray-700 hover:text-navy-900 px-3 py-2">Hakkımızda</Link>
            <Link to="/contact" className="text-gray-700 hover:text-navy-900 px-3 py-2">İletişim</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-navy-900 px-3 py-2">Projeler</Link>
                <Link to="/profile" className="text-gray-700 hover:text-navy-900">
                  Hoş geldin, {user.user_metadata.full_name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-navy-900 px-3 py-2"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-navy-900 px-3 py-2">Giriş Yap</Link>
                <Link to="/register" className="bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-700">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-navy-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-navy-900">Ana Sayfa</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-navy-900">Hakkımızda</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-navy-900">İletişim</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-navy-900">Projeler</Link>
                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:text-navy-900">
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-navy-900"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-navy-900">Giriş Yap</Link>
                <Link to="/register" className="block px-3 py-2 text-navy-900 font-medium">Kayıt Ol</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}