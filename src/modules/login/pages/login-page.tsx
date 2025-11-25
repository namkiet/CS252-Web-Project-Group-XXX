import { useState } from 'react';

import { AuthLayout } from '../components/auth-layout';
import { BrandingSection } from '../components/branding-section';
import { AuthFormCard } from '../components/auth-form-card';

import backgroundImage from '@/assets/images/slide3.jpg'

export default function LogInPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout backgroundImage={backgroundImage}>
      <BrandingSection />

      <AuthFormCard 
        isLogin={isLogin} 
        setIsLogin={setIsLogin} 
      />
    </AuthLayout>
  );
}