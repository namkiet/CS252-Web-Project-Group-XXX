import React from 'react'
import { Button } from '@/shared/components/ui/button'
import { Flame, MapPin } from 'lucide-react'
import { SlideInOnScroll } from './slideInOnScroll'
import streetFoodImage from '@/assets/images/street-food.jpg'
import authenticFoodImage from '@/assets/images/authentic-food.jpg'

export const AboutSection = () => (
  <section className="relative bg-gray-50 py-24 pt-36">
    <div
      className="absolute left-0 w-full h-16 bg-gray-50"
      style={{
        top: '-4rem',
        clipPath: 'polygon(50% 0%, 100% 100%, 0 100%)',
      }}
    />

    <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
      {/* Left */}
      <div className="flex flex-col justify-center">
        <SlideInOnScroll>
          <Flame className="w-16 h-16 text-yellow-600" />
          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Local Food
          </h2>
          <div className="my-4 h-1 w-24 bg-yellow-500" />
        </SlideInOnScroll>
        
        <p className="mb-6 text-gray-600">
          Tired of scrolling through endless reviews or falling into tourist traps? 
          Real local food isn't always on the front page of travel guides. 
          It's in the small alleys and family-run spots that only locals know.
        </p>
        <p className="mb-8 text-gray-600">
          Our AI analyzes thousands of data points to curate a personalized dining 
          journey just for you. Whether you crave street food or traditional dishes, 
          we guide you to the most authentic flavors in town.
        </p>
        <Button
          asChild
          className="text-lg font-semibold rounded-full bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand)]/90 px-8 py-6 self-start"
        >
          <a href="/chat">Create Itinerary</a>
        </Button>
      </div>

      {/* Right */}
      <div className="grid grid-cols-2 gap-4">
        <img
          src={streetFoodImage}
          alt="Local Street Food"
          className="object-cover w-full h-full rounded-lg shadow-lg transition-transform hover:scale-105 duration-500"
          style={{ height: '400px' }}
        />
        <img
          src={authenticFoodImage}
          alt="Authentic Dish"
          className="object-cover w-full h-full rounded-lg shadow-lg mt-12 transition-transform hover:scale-105 duration-500"
          style={{ height: '400px' }}
        />
      </div>
    </div>
  </section>
)