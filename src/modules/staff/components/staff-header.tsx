import { useTranslation } from 'react-i18next';
import { SlideInOnScroll } from '@/shared/components/slideInOnScroll';

export const StaffHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 text-center">
      <SlideInOnScroll>
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 md:mb-6">
          {t('staff.header_title')}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed px-2">
          {t('staff.header_desc')}
        </p>
      </SlideInOnScroll>
    </div>
  );
};