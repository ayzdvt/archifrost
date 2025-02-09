import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = "h-8 w-auto", variant = 'dark' }: LogoProps) {
  // GitHub raw content URL'lerini kullan
  const logoUrl = variant === 'light' 
    ? "https://raw.githubusercontent.com/ayzdvt/archifrost-brand/main/logo.png"
    : "https://raw.githubusercontent.com/ayzdvt/archifrost-brand/main/logo2.png";

  return (
    <img
      src={logoUrl}
      alt="ArchiFrost"
      className={className}
      onError={(e) => {
        console.error('Logo yüklenirken hata:', e);
      }}
    />
  );
}