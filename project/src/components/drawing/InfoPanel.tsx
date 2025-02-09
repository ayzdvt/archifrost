import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface InfoPanelProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const InfoPanel: React.FC<InfoPanelProps> = ({ message, type = 'info', action }) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-400 text-green-800';
      default:
        return 'bg-blue-50 border-blue-400 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t ${getStyles()}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <p className="text-sm font-medium">{message}</p>
          </div>
          {action && (
            <button
              onClick={action.onClick}
              className="ml-4 px-4 py-2 text-sm font-medium rounded-md bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;