import React from 'react';
import { Move, Save } from 'lucide-react';

interface ToolbarProps {
  isPanMode: boolean;
  saving: boolean;
  hasPoints: boolean;
  onTogglePan: () => void;
  onFitAll: () => void;
  onSave: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  isPanMode,
  saving,
  hasPoints,
  onTogglePan,
  onFitAll,
  onSave
}) => {
  return (
    <div className="flex space-x-4">
      <button
        onClick={onTogglePan}
        className={`flex items-center px-4 py-2 rounded-md ${
          isPanMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Move className="h-5 w-5 mr-2" />
        {isPanMode ? 'Kaydırma Aktif' : 'Kaydır'}
      </button>
      <button
        onClick={onFitAll}
        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        Tümünü Göster
      </button>
      <button
        onClick={onSave}
        disabled={saving || !hasPoints}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Save className="h-5 w-5 mr-2" />
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </div>
  );
};

export default Toolbar;