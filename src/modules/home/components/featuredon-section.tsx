import React from 'react'
import { Clock, Wallet, MapPin, Star } from 'lucide-react'

export const FeaturedOnSection = () => (
  <section className="bg-gray-50 py-16 border-b border-gray-200">
    <div className="container mx-auto max-w-6xl px-6 text-center">
      <h3 className="mb-10 text-sm font-bold uppercase tracking-widest text-gray-400">
        Why travelers love us
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-24">
        <div className="flex flex-col items-center gap-3 group">
          <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
             <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <span className="text-lg font-bold text-gray-700">
            Save Time
          </span>
          <span className="text-sm text-gray-500">Plan in seconds</span>
        </div>

        <div className="flex flex-col items-center gap-3 group">
          <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
             <MapPin className="w-8 h-8 text-orange-500" />
          </div>
          <span className="text-lg font-bold text-gray-700">
            Authentic Spots
          </span>
          <span className="text-sm text-gray-500">No tourist traps</span>
        </div>

        <div className="flex flex-col items-center gap-3 group">
          <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
             <Wallet className="w-8 h-8 text-orange-500" />
          </div>
          <span className="text-lg font-bold text-gray-700">
            Smart Budget
          </span>
          <span className="text-sm text-gray-500">Price estimation</span>
        </div>

        <div className="flex flex-col items-center gap-3 group">
          <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
             <Star className="w-8 h-8 text-orange-500" />
          </div>
          <span className="text-lg font-bold text-gray-700">
            Top Rated
          </span>
          <span className="text-sm text-gray-500">Curated by AI</span>
        </div>
      </div>
    </div>
  </section>
)