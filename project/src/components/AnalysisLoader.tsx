import React from 'react';
import Logo from './Logo';

export default function AnalysisLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      <div className="relative z-10 text-center">
        <div className="animate-pulse mb-8">
          <Logo className="w-96 h-auto mx-auto" variant="dark" />
        </div>
        <div className="max-w-sm mx-auto">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div className="absolute inset-0 bg-navy-900 animate-[loading_2s_ease-in-out_infinite]" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-navy-900 mb-2">
          Yapay Zeka Analizi Devam Ediyor
        </h3>
        <p className="text-navy-700">
          Belgeleriniz yapay zeka tarafından analiz ediliyor. Bu işlem birkaç saniye sürebilir.
        </p>
      </div>
    </div>
  );
}