import { useTranslation } from 'react-i18next'
import { Clock, Wallet, MapPin, Star } from 'lucide-react'
import { SlideInOnScroll } from '@/shared/components/slideInOnScroll'

export const FeaturedOnSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Clock,
      title: t('home.features.save_time.title'),
      desc: t('home.features.save_time.desc')
    },
    {
      icon: MapPin,
      title: t('home.features.authentic.title'),
      desc: t('home.features.authentic.desc')
    },
    {
      icon: Wallet,
      title: t('home.features.budget.title'),
      desc: t('home.features.budget.desc')
    },
    {
      icon: Star,
      title: t('home.features.rated.title'),
      desc: t('home.features.rated.desc')
    }
  ];

  return (
    <section className="bg-gray-50 py-12 md:py-16 border-b border-gray-200">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 text-center">
        <SlideInOnScroll direction='down' duration={1100}>
          <h3 className="mb-8 md:mb-12 text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">
            {t('home.features.main_title')}
          </h3>
        </SlideInOnScroll>

        <SlideInOnScroll direction='up' duration={1100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center gap-3 group">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md
                  transition-all duration-300 transform group-hover:-translate-y-1">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base md:text-lg font-bold text-gray-700">
                    {feature.title}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500">
                    {feature.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SlideInOnScroll>
      </div>
    </section>
  )
}