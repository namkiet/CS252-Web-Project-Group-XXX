import { SlideInOnScroll } from '@/shared/components/slideInOnScroll';
import backgroundImage from '@/assets/images/slide3.jpg';

export const StaffBanner = () => {
  return (
    <div className="relative w-full h-60 md:h-80 bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <img
          src={backgroundImage}
          alt="Restaurant Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 text-center px-4">
        <SlideInOnScroll>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">
            Let's explore Vietnamese Food.
          </h2>
        </SlideInOnScroll>
      </div>
    </div>
  );
};