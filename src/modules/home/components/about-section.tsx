import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { Flame } from 'lucide-react'
import { SlideInOnScroll } from '@/shared/components/slideInOnScroll'
import streetFoodImage from '@/assets/images/street-food.jpg'
import authenticFoodImage from '@/assets/images/authentic-food.jpg'

export const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gray-50 py-16 pt-24 md:py-24 md:pt-36">
      <div
        className="absolute left-0 w-full h-12 -top-12 md:h-16 md:-top-16 bg-gray-50"
        style={{
          clipPath: 'polygon(50% 0%, 100% 100%, 0 100%)',
        }}
      />

      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2 items-center">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <SlideInOnScroll direction='down' duration={1100}>
            <Flame className="w-12 h-12 md:w-16 md:h-16 text-yellow-600" />
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900">
              {t('home.about.title')}
            </h2>
            <div className="my-4 h-1 w-20 md:w-24 bg-yellow-500" />
          </SlideInOnScroll>
          
          <SlideInOnScroll direction='left' duration={1100}>
            <p className="mb-4 md:mb-6 text-gray-600 text-base md:text-lg">
              {t('home.about.p1')}
            </p>
            <p className="mb-6 md:mb-8 text-gray-600 text-base md:text-lg">
              {t('home.about.p2')}
            </p>
          </SlideInOnScroll>
          <SlideInOnScroll direction='up' duration={1100}>
            <Button
              asChild
              className="text-base md:text-lg font-semibold rounded-full bg-[var(--color-brand)]
                text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand)]/90 px-6 py-5 md:px-8 md:py-6 self-start"
            >
              <a href="/chat">{t('home.about.btn_create')}</a>
            </Button>
          </SlideInOnScroll>
        </div>

        {/* Right */}
        <SlideInOnScroll direction='right' duration={800}>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <img
              src={streetFoodImage}
              alt={t('home.about.img_street_alt')}
              className="object-cover w-full h-[250px] md:h-[400px] rounded-lg shadow-lg transition-transform hover:scale-105 duration-500"
            />
            <img
              src={authenticFoodImage}
              alt={t('home.about.img_authentic_alt')}
              className="object-cover w-full h-[250px] md:h-[400px] rounded-lg shadow-lg mt-8 md:mt-12 transition-transform hover:scale-105 duration-500"
            />
          </div>
        </SlideInOnScroll>
      </div>
    </section>
  )
};