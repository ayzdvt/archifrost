import React from 'react';
import { Users, Target, History } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Hakkımızda</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          ArchiTech, mimari projeleri yapay zeka ile otomatikleştirerek mimarların ve mühendislerin 
          işlerini kolaylaştırmayı hedefleyen yenilikçi bir platformdur.
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
          <Target className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="text-2xl font-semibold">Misyonumuz</h2>
          <p className="text-gray-600">
            Mimari projelerin hazırlanma sürecini yapay zeka ile otomatikleştirerek, 
            mimarların yaratıcılıklarına daha fazla zaman ayırmalarını sağlamak.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
          <History className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="text-2xl font-semibold">Hikayemiz</h2>
          <p className="text-gray-600">
            2023 yılında kurulan ArchiTech, mimarlık ve teknoloji dünyasını 
            bir araya getirerek sektörde devrim yaratmayı hedeflemektedir.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
          <Users className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="text-2xl font-semibold">Ekibimiz</h2>
          <p className="text-gray-600">
            Deneyimli mimarlar, yazılım mühendisleri ve yapay zeka uzmanlarından 
            oluşan ekibimiz, en iyi çözümleri sunmak için çalışmaktadır.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Yönetim Ekibimiz</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=300&q=80"
              alt="CEO"
              className="w-48 h-48 rounded-full mx-auto object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">Ayşe Yılmaz</h3>
              <p className="text-gray-600">CEO & Kurucu</p>
            </div>
          </div>
          <div className="text-center space-y-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80"
              alt="CTO"
              className="w-48 h-48 rounded-full mx-auto object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">Mehmet Demir</h3>
              <p className="text-gray-600">CTO</p>
            </div>
          </div>
          <div className="text-center space-y-4">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80"
              alt="Lead Architect"
              className="w-48 h-48 rounded-full mx-auto object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">Zeynep Kaya</h3>
              <p className="text-gray-600">Baş Mimar</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}