import { useTranslation } from 'react-i18next';
import { Utensils } from 'lucide-react';

export const MainHeader = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex items-center gap-3">
          <Utensils className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
          <div>
            <h1 className="text-orange-900 text-lg md:text-xl font-bold">{t('guide.header.title')}</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5">{t('guide.header.subtitle')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};