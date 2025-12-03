import { Utensils } from 'lucide-react';

export const MainHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <Utensils className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-orange-900 text-xl font-bold">Culinary Tourism Guide</h1>
            <p className="text-gray-600 mt-1">Explore authentic dishes by province and country</p>
          </div>
        </div>
      </div>
    </header>
  );
};