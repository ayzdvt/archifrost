import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types/drawing';

export function useProjectData(projectId: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!projectId) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('parcel_coordinates, land_area, front_setback')
          .eq('id', projectId)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err: any) {
        console.error('Proje verileri yüklenirken hata:', err);
        setError('Proje verileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  return { project, loading, error };
}