import React, { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';

const messagesArray = [
  "ArchiFrost çizim asistanına hoş geldiniz.",
  "Hadi önce bina oturumunu bulalım",
  "Lütfen yola cephe olan kenarları işaretleyin"
];

interface Message {
  id: number;
  text: string;
  type: 'assistant' | 'system';
}

interface ChatBotProps {
  onStartEdgeSelection?: () => void;
  onCompleteSelection?: () => void;
  selectedEdgesCount?: number;
}

const ChatBot: React.FC<ChatBotProps> = ({ 
  onStartEdgeSelection,
  onCompleteSelection,
  selectedEdgesCount = 0 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentTyped, setCurrentTyped] = useState("");
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const charIndexRef = useRef(0);
  const currentMessageRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedEdgesCount > 0) {
      setShowCompleteButton(true);
    }
  }, [selectedEdgesCount]);

  const typeNextChar = () => {
    if (charIndexRef.current < currentMessageRef.current.length) {
      setCurrentTyped(currentMessageRef.current.slice(0, charIndexRef.current + 1));
      charIndexRef.current++;
      
      typingTimeoutRef.current = setTimeout(typeNextChar, 67);
    } else {
      // Message complete
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: currentMessageRef.current,
        type: 'assistant'
      }]);
      setCurrentTyped("");
      
      // Start edge selection mode when the second message is complete
      if (currentMessageIndex === 1 && onStartEdgeSelection) {
        setTimeout(() => {
          onStartEdgeSelection();
        }, 500);
      }
      
      setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
      }, 500);
    }
  };

  useEffect(() => {
    if (currentMessageIndex < messagesArray.length) {
      // Reset typing state
      charIndexRef.current = 0;
      currentMessageRef.current = messagesArray[currentMessageIndex];
      
      // Start typing
      typingTimeoutRef.current = setTimeout(typeNextChar, 67);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentMessageIndex]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTyped]);

  const handleCompleteSelection = () => {
    if (onCompleteSelection) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Kenar seçimi tamamlandı.",
        type: 'system'
      }]);
      onCompleteSelection();
    }
  };

  return (
    <div className="fixed left-0 top-[72px] bottom-0 w-80 bg-white shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-navy-900 text-white p-4 flex items-center space-x-3">
        <div className="bg-white rounded-full p-2 shadow-sm w-10 h-10 flex-shrink-0">
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
            </g>
          </svg>
        </div>
        <div>
          <h3 className="font-semibold">ArchiFrost Asistan</h3>
          <p className="text-xs text-gray-300">Çevrimiçi</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'assistant'
                  ? 'bg-white text-gray-800'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {currentTyped && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-white rounded-lg p-3 text-gray-800">
              <p className="text-sm">{currentTyped}</p>
              <span className="flex space-x-1 mt-2">
                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border-t">
        {showCompleteButton && (
          <button
            onClick={handleCompleteSelection}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Seçimi Tamamla</span>
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatBot;