import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Zap, FileOutput } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Mimari Projelerinizi Hızla ve Hatasız Şekilde Tamamlayın
              </h1>
              <p className="text-xl text-blue-100">
                Yapay zeka destekli platformumuz ile mimari projelerinizi otomatikleştirin,
                zamandan tasarruf edin ve hatasız sonuçlar elde edin.
              </p>
              <div className="space-x-4">
                <button
                  onClick={handleGetStarted}
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Hemen Başlayın
                </button>
                <Link
                  to="/about"
                  className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Daha Fazla Bilgi
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
                alt="Modern Architecture"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Öne Çıkan Özellikler</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <Brain className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Yapay Zeka Otomasyonu</h3>
            <p className="text-gray-600">
              İleri düzey yapay zeka algoritmaları ile projelerinizi otomatik olarak işleyin ve optimize edin.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Hızlı Sonuçlar</h3>
            <p className="text-gray-600">
              Projelerinizi dakikalar içinde tamamlayın, manuel işlemlerle saatler harcamayın.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <FileOutput className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">DWG Format Desteği</h3>
            <p className="text-gray-600">
              Projelerinizi endüstri standardı DWG formatında alın ve doğrudan kullanıma başlayın.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}