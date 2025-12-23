import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

// Branding Section (For only desktop)
export const BrandingSection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: '🤖', text: t('auth.branding.features.ai') },
    { icon: '🥗', text: t('auth.branding.features.plans') },
    { icon: '📅', text: t('auth.branding.features.smart') },
    { icon: '🌱', text: t('auth.branding.features.diet') }
  ];

  return (
    <div className="hidden lg:block lg:col-span-3">
      <div className="space-y-4 text-white">
        {/* Tag Line */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="text-gray-700">{t('auth.branding.tagline')}</span>
        </div>

        {/* Title */}
        <h1 className="text-white font-bold text-4xl lg:text-5xl drop-shadow-lg">
          {t('auth.branding.title')}<br />
          <span className="bg-gradient-to-r from-orange-400 to-green-300 bg-clip-text text-transparent">
            Local Food
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-200 max-w-md drop-shadow">
          {t('auth.branding.desc')}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center flex-shrink-0">
                <span>{feature.icon}</span>
              </div>
              <span className="text-sm text-gray-100">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};