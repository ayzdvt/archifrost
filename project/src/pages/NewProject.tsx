import React, { useState } from 'react';
import { Upload, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { analyzeDocument } from '../lib/gemini';
import AnalysisLoader from '../components/AnalysisLoader';

export default function NewProject() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<string>('');
  const [analysisErrors, setAnalysisErrors] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...uploadedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, projectId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Dosya yükleme hatası: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-documents')
        .getPublicUrl(filePath);

      return {
        name: file.name,
        file_url: publicUrl,
        file_type: file.type
      };
    } catch (err) {
      const error = err as Error;
      throw new Error(`Dosya yüklenirken hata oluştu: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAnalysisErrors([]);
    setAnalysisResults([]);
    setLoading(true);
    setAnalyzing(true);
    setProgress('Belgeler analiz ediliyor...');

    try {
      if (!files.length) {
        throw new Error('Lütfen en az bir belge yükleyin');
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error(`Kullanıcı bilgisi alınamadı: ${userError.message}`);
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      let projectDetails = {};
      const newAnalysisErrors = [];
      const results = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`${file.name} analiz ediliyor (${i + 1}/${files.length})...`);
        
        try {
          const analysis = await analyzeDocument(file);
          if (!analysis) {
            throw new Error('Belge analizi sonuç döndürmedi');
          }
          results.push({ file: file.name, ...analysis });
          projectDetails = {
            ...projectDetails,
            ...Object.fromEntries(
              Object.entries(analysis).filter(([_, value]) => value != null)
            )
          };
        } catch (err) {
          const error = err as Error;
          console.error('Belge analiz hatası:', error.message);
          newAnalysisErrors.push(`${file.name}: ${error.message}`);
        }
      }

      if (newAnalysisErrors.length === files.length) {
        throw new Error('Hiçbir belge analiz edilemedi. Lütfen geçerli belgeler yüklediğinizden emin olun.');
      }

      setAnalysisResults(results);

      if (newAnalysisErrors.length > 0) {
        setAnalysisErrors(newAnalysisErrors);
      }

      setProgress('Proje oluşturuluyor...');

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          { 
            name: projectName, 
            user_id: user.id,
            ...projectDetails
          }
        ])
        .select()
        .single();

      if (projectError) {
        throw new Error(`Proje oluşturulamadı: ${projectError.message}`);
      }

      if (!project) {
        throw new Error('Proje oluşturulamadı: Sunucudan yanıt alınamadı');
      }

      setProgress('Belgeler yükleniyor...');

      const uploadPromises = files.map(async (file) => {
        try {
          const fileData = await uploadFile(file, project.id);
          const { error: docError } = await supabase
            .from('documents')
            .insert([
              {
                project_id: project.id,
                ...fileData
              }
            ]);

          if (docError) {
            throw new Error(`Belge kaydedilemedi: ${docError.message}`);
          }
        } catch (err) {
          const error = err as Error;
          throw new Error(`${file.name} yüklenirken hata oluştu: ${error.message}`);
        }
      });

      await Promise.all(uploadPromises).catch((err) => {
        throw new Error(`Belgeler yüklenirken hata oluştu: ${err.message}`);
      });

      navigate(`/project/${project.id}`);
    } catch (err) {
      const error = err as Error;
      console.error('Proje oluşturma hatası:', error.message);
      setError(error.message || 'Proje oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
      setAnalyzing(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {progress && (
          <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
            {progress}
          </div>
        )}

        {analyzing && <AnalysisLoader />}

        {analysisErrors.length > 0 && (
          <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
            <p className="font-medium mb-2">Bazı belgeler analiz edilirken sorun oluştu:</p>
            <ul className="list-disc list-inside">
              {analysisErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {analysisResults.length > 0 && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            <p className="font-medium mb-2">Analiz Sonuçları:</p>
            <div className="space-y-4">
              {analysisResults.map((result, index) => (
                <div key={index} className="bg-white p-4 rounded border border-green-100">
                  <p className="font-medium mb-2">{result.file}</p>
                  <ul className="text-sm space-y-1">
                    <li>İl: {result.city || 'Bulunamadı'}</li>
                    <li>İlçe: {result.district || 'Bulunamadı'}</li>
                    <li>Mahalle: {result.neighborhood || 'Bulunamadı'}</li>
                    <li>Ada: {result.block || 'Bulunamadı'}</li>
                    <li>Parsel: {result.parcel || 'Bulunamadı'}</li>
                    <li>Arsa Alanı: {result.land_area ? `${result.land_area} m²` : 'Bulunamadı'}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Yeni Proje Oluştur</h2>
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                Proje Adı
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Projenizin adını girin"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!projectName.trim()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                İleri
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Belgeleri Yükle</h2>
            <p className="text-sm text-gray-600">
              Lütfen ilgili belediyelerden alınan İmar Durumu Belgesi, İnşaat İstikamet Rölevesi, Plan notları belgelerini sisteme yükleyiniz.
            </p>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg text-gray-700">
                Dosyaları sürükleyip bırakın veya
              </p>
              <label className="mt-2 inline-block">
                <span className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 cursor-pointer">
                  Belge Yükle
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                PDF ve görsel dosyaları desteklenir
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Girmiş olduğunuz belgeler yapay zeka asistanları tarafından analiz edilecek ve proje detayları otomatik olarak doldurulacaktır.
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Yüklenen Belgeler:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Kaldır
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Geri
              </button>
              <button
                onClick={handleSubmit}
                disabled={files.length === 0 || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  analyzing ? 'Belgeler Analiz Ediliyor...' : 'Proje Oluşturuluyor...'
                ) : 'Projeyi Oluştur'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}