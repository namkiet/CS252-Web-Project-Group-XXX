import { SlideInOnScroll } from '@/shared/components/slideInOnScroll';

export const StaffHeader = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <SlideInOnScroll>
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">My Staff</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          The passionate experts behind your personalized culinary adventures.
        </p>
      </SlideInOnScroll>
    </div>
  );
};