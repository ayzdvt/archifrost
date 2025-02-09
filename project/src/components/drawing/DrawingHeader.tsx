import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DrawingHeaderProps {
  projectId: string;
  calculatedArea: number | null;
  projectArea: number | null;
}

export default function DrawingHeader({ projectId, calculatedArea, projectArea }: DrawingHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Geri
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Çizim Ekranı</h1>
          {calculatedArea !== null && (
            <p className="text-sm text-gray-600">
              Çizilen Alan: {calculatedArea.toFixed(2)}m²
              {projectArea && (
                <span className="ml-2">
                  (Belgedeki Alan: {projectArea}m²)
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}