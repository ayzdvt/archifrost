import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

export default function Footer() {
  const [user, setUser] = useState<any>(null);

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

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Logo className="h-10 w-auto" variant="light" />
            </Link>
            <p className="text-gray-400">
              Mimari projelerinizi yapay zeka ile otomatikleştirin.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Ana Sayfa</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">Hakkımızda</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">İletişim</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hesap</h3>
            <ul className="space-y-2">
              {user ? (
                <>
                  <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Projeler</Link></li>
                  <li><Link to="/profile" className="text-gray-400 hover:text-white">Profil</Link></li>
                  <li><Link to="/new-project" className="text-gray-400 hover:text-white">Yeni Proje</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="text-gray-400 hover:text-white">Giriş Yap</Link></li>
                  <li><Link to="/register" className="text-gray-400 hover:text-white">Kayıt Ol</Link></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-400">
              <li>info@archifrost.com</li>
              <li>+90 (212) 555 0123</li>
              <li>İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ArchiFrost. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}