import React from 'react'
import { Button } from '@/shared/components/ui/button'
import { SlideInOnScroll } from './slideInOnScroll'
import { Sparkles, ArrowRight } from 'lucide-react';
import heroBgImage from '@/assets/images/slide1.jpg'

export const HeroSection = () => (
  <div
    className='relative flex h-screen min-h-[700px] items-center justify-center text-center text-white'
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="flex flex-col items-center p-4">
      <SlideInOnScroll>
        <div className="mb-3 text-lg font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2" style={{ color: 'var(--color-brand)' }}>
          <Sparkles className="w-5 h-5" />
          AI-Powered Food Planner 
        </div>
        <h1 className="mb-6 text-4xl font-bold md:text-8xl">
          Taste & Plan
        </h1>
        <p className="mx-auto mt-14 text-center max-w-2xl text-lg text-gray-100 drop-shadow-md mb-8">
          Don't waste hours searching. Just tell us where you're going, 
          and our AI will generate a personalized food itinerary 
          tailored to your taste.
        </p>
      </SlideInOnScroll>

      <div className= "flex justify-center">
        <Button
          asChild
          className="bg-transparent border-1 border-yellow-300 text-yellow-400 hover:bg-yellow-400/10 
                     text-base font-semibold rounded-full min-w-[150px] py-6 flex items-center gap-2 transition-all duration-300"
        >
          <a href="/chat">
            Explore
            <ArrowRight className="w-5 h-5 transform scale-x-150 origin-left" />
          </a>
        </Button>
      </div>
    </div>
  </div>
)