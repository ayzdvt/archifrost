import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">İletişime Geçin</h1>
            <p className="mt-4 text-lg text-gray-600">
              Sorularınız veya önerileriniz için bize ulaşın. En kısa sürede size dönüş yapacağız.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Konu
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Gönder
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8 lg:pl-8">
          <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold">E-posta</h3>
                <p className="text-gray-600">info@architech.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold">Telefon</h3>
                <p className="text-gray-600">+90 (212) 555 0123</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold">Adres</h3>
                <p className="text-gray-600">
                  Levent Mahallesi, İş Kuleleri<br />
                  Kule-2, Kat:8<br />
                  34330 Beşiktaş/İstanbul
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-gray-200 rounded-lg h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.827461440436!2d29.007123!3d41.079774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab63f6f4a11ed%3A0xe67c6d5e78b2a0f1!2zTGV2ZW50LCBCZcWfaWt0YcWfL8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}