import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button'
import { SlideInOnScroll } from '@/shared/components/slideInOnScroll';
import { Sparkles, ArrowRight } from 'lucide-react';
import heroBgImage from '@/assets/images/slide1.jpg'

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div
      className='relative flex h-screen min-h-[700px] md:min-h-[800px] -mt-18 items-center justify-center text-center text-white'
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col items-center p-4 w-full max-w-4xl px-6">
        <SlideInOnScroll direction='down' duration={1100}>
          <div className="mb-3 text-sm md:text-lg font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2" style={{ color: 'var(--color-brand)' }}>
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            {t('home.hero.subtitle')} 
          </div>
          <h1 className="mb-6 text-5xl sm:text-6xl md:text-8xl font-bold leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="mx-auto mt-8 md:mt-14 text-center max-w-2xl text-base md:text-lg text-gray-100 drop-shadow-md mb-8">
            {t('home.hero.desc')}
          </p>
        </SlideInOnScroll>

        <SlideInOnScroll direction='up' duration={1100}>
          <div className= "flex justify-center">
            <Button
              asChild
              className="bg-transparent border-1 border-yellow-300 text-yellow-400 hover:bg-yellow-400/10 
                text-base font-semibold rounded-full min-w-[140px] md:min-w-[150px] py-6 flex items-center gap-2 transition-all duration-300"
            >
              <Link to="/chat">
                {t('home.hero.btn_explore')}
                <ArrowRight className="w-5 h-5 transform scale-x-150 origin-left" />
              </Link>
            </Button>
          </div>
        </SlideInOnScroll>
      </div>
    </div>
  )
}