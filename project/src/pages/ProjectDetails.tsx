import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ProjectDetails } from '../lib/gemini';

interface Project extends ProjectDetails {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err: any) {
      console.error('Proje yüklenirken hata:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project) return;
    
    setSaving(true);
    setError('');

    try {
      const { error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id);

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Proje güncellenirken hata:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Proje silinirken hata:', err);
      setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: ['land_area', 'front_setback', 'side_setback', 'rear_setback', 'roof_angle', 'ground_coverage_ratio', 'floor_area_ratio'].includes(name) 
          ? Number(value) || null
          : value
      };
    });
  };

  const getDefaultValue = (field: string, value: any) => {
    const defaults: { [key: string]: { value: any; message: string } } = {
      front_setback: { value: 5, message: 'Yapay zeka ön bahçe mesafesini okuyamadı. Standart değer (5m) girildi. Lütfen doğruluğunu kontrol edin.' },
      side_setback: { value: 3, message: 'Yapay zeka yan bahçe mesafesini okuyamadı. Standart değer (3m) girildi. Lütfen doğruluğunu kontrol edin.' },
      rear_setback: { value: 3, message: 'Yapay zeka arka bahçe mesafesini okuyamadı. Standart değer (3m) girildi. Lütfen doğruluğunu kontrol edin.' },
      roof_angle: { value: 45, message: 'Yapay zeka çatı eğimini okuyamadı. Standart değer (45°) girildi. Lütfen doğruluğunu kontrol edin.' }
    };

    if (value === null && defaults[field]) {
      return defaults[field];
    }
    return { value, message: '' };
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (!project) {
    return <div className="text-center py-8">Proje bulunamadı</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 rounded-t-lg">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Proje Adı
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={project.name}
              onChange={handleChange}
              className="block w-full text-2xl font-bold bg-transparent border-0 focus:ring-0 p-0 text-gray-900"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Tapu & Kadastral Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                  Malik
                </label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={project.owner || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  İl
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={project.city || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  İlçe
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={project.district || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                  Mahalle
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  value={project.neighborhood || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="sheet_no" className="block text-sm font-medium text-gray-700">
                  Pafta No
                </label>
                <input
                  type="text"
                  id="sheet_no"
                  name="sheet_no"
                  value={project.sheet_no || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="block" className="block text-sm font-medium text-gray-700">
                  Ada
                </label>
                <input
                  type="text"
                  id="block"
                  name="block"
                  value={project.block || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="parcel" className="block text-sm font-medium text-gray-700">
                  Parsel
                </label>
                <input
                  type="text"
                  id="parcel"
                  name="parcel"
                  value={project.parcel || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="land_area" className="block text-sm font-medium text-gray-700">
                  Arsa Alanı (m²)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="land_area"
                  name="land_area"
                  value={project.land_area || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Yapılanma Koşulları</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="building_order" className="block text-sm font-medium text-gray-700">
                    İnşaat Nizamı
                  </label>
                  <select
                    id="building_order"
                    name="building_order"
                    value={project.building_order || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Bitişik">Bitişik</option>
                    <option value="Ayrık">Ayrık</option>
                    <option value="Blok">Blok</option>
                    <option value="İkiz">İkiz</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="plan_position" className="block text-sm font-medium text-gray-700">
                    Planındaki Konumu
                  </label>
                  <select
                    id="plan_position"
                    name="plan_position"
                    value={project.plan_position || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Konut Alanı">Konut Alanı</option>
                    <option value="Ticaret Alanı">Ticaret Alanı</option>
                    <option value="Karma Kullanım Alanı">Karma Kullanım Alanı</option>
                    <option value="Sanayi Alanı">Sanayi Alanı</option>
                    <option value="Turizm Alanı">Turizm Alanı</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ground_coverage_ratio" className="block text-sm font-medium text-gray-700">
                    TAKS
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="ground_coverage_ratio"
                    name="ground_coverage_ratio"
                    value={project.ground_coverage_ratio || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="floor_area_ratio" className="block text-sm font-medium text-gray-700">
                    Emsal
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="floor_area_ratio"
                    name="floor_area_ratio"
                    value={project.floor_area_ratio || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="floor_count" className="block text-sm font-medium text-gray-700">
                    Kat Adedi
                  </label>
                  <input
                    type="text"
                    id="floor_count"
                    name="floor_count"
                    value={project.floor_count || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                    placeholder="Örn: En fazla 6 kat yapılabilir"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Çekme Mesafeleri</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="front_setback" className="block text-sm font-medium text-gray-700">
                      Ön Bahçe Mesafesi (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="front_setback"
                      name="front_setback"
                      value={getDefaultValue('front_setback', project.front_setback).value}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                        project.front_setback === null ? 'text-red-600' : ''
                      }`}
                    />
                    {project.front_setback === null && (
                      <p className="mt-1 text-sm text-red-600">
                        {getDefaultValue('front_setback', null).message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="side_setback" className="block text-sm font-medium text-gray-700">
                      Yan Bahçe Mesafesi (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="side_setback"
                      name="side_setback"
                      value={getDefaultValue('side_setback', project.side_setback).value}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                        project.side_setback === null ? 'text-red-600' : ''
                      }`}
                    />
                    {project.side_setback === null && (
                      <p className="mt-1 text-sm text-red-600">
                        {getDefaultValue('side_setback', null).message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rear_setback" className="block text-sm font-medium text-gray-700">
                      Arka Bahçe Mesafesi (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="rear_setback"
                      name="rear_setback"
                      value={getDefaultValue('rear_setback', project.rear_setback).value}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                        project.rear_setback === null ? 'text-red-600' : ''
                      }`}
                    />
                    {project.rear_setback === null && (
                      <p className="mt-1 text-sm text-red-600">
                        {getDefaultValue('rear_setback', null).message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Çatı Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="roof_type" className="block text-sm font-medium text-gray-700">
                      Çatı Katı
                    </label>
                    <select
                      id="roof_type"
                      name="roof_type"
                      value={project.roof_type || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Seçiniz</option>
                      <option value="yapılabilir">Yapılabilir</option>
                      <option value="yapılamaz">Yapılamaz</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="roof_angle" className="block text-sm font-medium text-gray-700">
                      Çatı Eğimi (derece)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="roof_angle"
                      name="roof_angle"
                      value={getDefaultValue('roof_angle', project.roof_angle).value}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white ${
                        project.roof_angle === null ? 'text-red-600' : ''
                      }`}
                    />
                    {project.roof_angle === null && (
                      <p className="mt-1 text-sm text-red-600">
                        {getDefaultValue('roof_angle', null).message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
              >
                Bu Projeyi Sil
              </button>
              <button
                type="button"
                onClick={() => navigate(`/drawing/${project.id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Çizime Geç
              </button>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Projeyi Sil</h3>
              <p className="text-gray-500 mb-6">
                Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  İptal
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}