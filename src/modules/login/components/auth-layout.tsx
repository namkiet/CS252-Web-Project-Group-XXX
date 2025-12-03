import React from 'react';

// Contain all layers (img and a fade layer above)
interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, backgroundImage }) => {
  return (
    <div
      className="flex items-center justify-center p-4 relative flex-grow min-h-full bg-cover bg-center"
      style={{
        minHeight: 'calc(100vh - 72px)', // For Navbar 72px
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Fade Layer */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs pointer-events-none"></div>

      {/* Branding + Form */}
      <div className="w-full max-w-6xl grid lg:grid-cols-5 gap-8 items-center relative z-10">
        {children}
      </div>
    </div>
  );
};