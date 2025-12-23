import { useTranslation } from 'react-i18next';
import { SlideInOnScroll } from '@/shared/components/slideInOnScroll';
import backgroundImage from '@/assets/images/slide3.jpg';

export const StaffBanner = () => {
  const { t } = useTranslation();
  
  return (
    <div className="relative w-full h-60 md:h-80 bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <img
          src={backgroundImage}
          alt={t('staff.banner_alt')}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 text-center px-4">
        <SlideInOnScroll>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">
            {t('staff.banner_text')}
          </h2>
        </SlideInOnScroll>
      </div>
    </div>
  );
};