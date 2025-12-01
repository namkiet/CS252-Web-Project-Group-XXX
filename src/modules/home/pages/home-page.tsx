import React from 'react'
import { HeroSection } from '../components/hero-section'
import { AboutSection } from '../components/about-section'
import { FeaturedOnSection } from '../components/featuredon-section'

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      <HeroSection />
      <AboutSection />
      <FeaturedOnSection />
    </div>
  )
}
