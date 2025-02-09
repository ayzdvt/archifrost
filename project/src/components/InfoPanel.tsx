import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface InfoPanelProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const InfoPanel: React.FC<InfoPanelProps> = ({ message, type = 'info', action }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setDisplayedMessage('');
    setIsTyping(true);
  }, [message]);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayedMessage(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Typing speed (milliseconds)
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, message]);

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

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t ${getStyles()}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-sm w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 430" className="w-full h-full">
                <g>
                  <path fill="#7066ED" d="m121.597 94.911-26.687 40.03v68.71L217 251.5l-.342-156.589z"/>
                  <path fill="#E3E3E3" d="m188.314 217.659-53.374-56.032-53.373 56.032v157.46h106.748"/>
                  <path fill="#402FE8" d="M293.025 83.609c29.85 8.38 51.73 35.8 51.73 68.33v223.18h-156.44v-223.18c0-32.53 21.88-59.95 51.73-68.33l26.49-28.54z"/>
                  <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                    d="m121.597 94.911-26.687 40.03v68.71L217 251.5l-.342-156.589zM94.91 134.94h95.464
                    m-2.06 82.719-53.374-56.032-53.373 56.032v157.46h106.748
                    M344.505 145.939h-155.94m-.251 24.109h156.444m-53.686-52.231H242
                    m51.025-34.208c29.85 8.38 51.73 35.8 51.73 68.33v223.18h-156.44v-223.18c0-32.53 21.88-59.95 51.73-68.33l26.49-28.54z"/>
                  <g>
                    <path fill="#E3E3E3" d="M278.243 347.09h36.39v-33.152h-36.39z"/>
                    <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                      d="M278.243 347.09h36.39v-33.152h-36.39z"/>
                  </g>
                  <g>
                    <path fill="#E3E3E3" d="M218.243 347.09h36.39v-33.152h-36.39z"/>
                    <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                      d="M218.243 347.09h36.39v-33.152h-36.39z"/>
                  </g>
                  <g>
                    <path fill="#E3E3E3" d="M278.243 291.09h36.39v-33.152h-36.39z"/>
                    <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                      d="M278.243 291.09h36.39v-33.152h-36.39z"/>
                  </g>
                  <g>
                    <path fill="#E3E3E3" d="M218.243 291.09h36.39v-33.152h-36.39z"/>
                    <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                      d="M218.243 291.09h36.39v-33.152h-36.39z"/>
                  </g>
                  <g>
                    <path fill="#E3E3E3" d="M278.243 235.09h36.39v-33.152h-36.39z"/>
                    <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                      d="M278.243 235.09h36.39v-33.152h-36.39z"/>
                  </g>
                  <g>
                    <path fill="#E3E3E3" d="M218.243 235.09h36.39v-33.152h-36.39z"/>
                    <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                      d="M218.243 235.09h36.39v-33.152h-36.39z"/>
                  </g>
                  <g>
                    <path fill="#848484" d="M114.925 343.095h40.03v-42.698h-40.03z"/>
                    <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                      d="M114.925 343.095h40.03v-42.698h-40.03z"/>
                  </g>
                  <g>
                    <path fill="#848484" d="M114.925 268.595h40.03v-42.698h-40.03z"/>
                    <path fill="none" stroke="#121330" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" 
                      d="M114.925 268.595h40.03v-42.698h-40.03z"/>
                  </g>
                </g>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">Asistan</span>
                {isTyping && (
                  <span className="flex space-x-1">
                    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>
              <p className="text-sm mt-1">{displayedMessage}</p>
            </div>
          </div>
          {action && currentIndex === message.length && (
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