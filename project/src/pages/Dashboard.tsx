import React, { useEffect, useState } from 'react';
import { Plus, FileText, CheckCircle, Clock, Download, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  name: string;
  status: string;
  created_at: string;
  city?: string;
  district?: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndProjects();
  }, []);

  const fetchUserAndProjects = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      setUserName(profile?.full_name || user.user_metadata.full_name || '');

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          documents (
            id,
            name,
            file_url,
            file_type,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      setProjects(projectsData || []);
    } catch (err: any) {
      console.error('Projeler yüklenirken hata:', err);
      setError(err.message || 'Projeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
      setShowDeleteConfirm(null);
    } catch (err: any) {
      console.error('Proje silinirken hata:', err);
      setError(err.message || 'Proje silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
        <Link
          to="/new-project"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Proje
        </Link>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Toplam Projeler</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Devam Eden</p>
              <p className="text-2xl font-bold">
                {projects.filter(p => p.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Projelerim</h2>
        </div>
        {projects.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            Henüz hiç projeniz yok. Yeni bir proje oluşturmak için "Yeni Proje" butonuna tıklayın.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {projects.map((project) => (
              <div key={project.id} className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link 
                        to={`/project/${project.id}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800"
                      >
                        {project.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {project.city && project.district && (
                          <span className="mr-2">{project.city} / {project.district}</span>
                        )}
                        <span>Oluşturulma: {new Date(project.created_at).toLocaleDateString('tr-TR')}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                      </span>
                      <Link
                        to={`/project/${project.id}`}
                        className="text-gray-600 hover:text-blue-600"
                        title="Düzenle"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(project.id)}
                        className="text-gray-600 hover:text-red-600"
                        title="Sil"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === project.id && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <p className="text-red-700 mb-4">
                        Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {project.documents && project.documents.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Belgeler</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(doc.created_at).toLocaleDateString('tr-TR')}
                                </p>
                              </div>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="Dosyayı indir"
                            >
                              <Download className="h-5 w-5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}