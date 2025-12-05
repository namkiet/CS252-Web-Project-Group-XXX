import flagImg from '@/assets/images/vn-flag.png';

export const VietnamLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[200px] gap-2 bg-transparent">
      <style>
        {`
          @keyframes shimmer-slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer-slide {
            animation: shimmer-slide 1.5s infinite linear;
          }
        `}
      </style>

      <div className="relative w-10 h-auto overflow-hidden">
         <img 
           src={flagImg} 
           alt="Loading..."
           className="w-full h-full object-contain drop-shadow-sm"
           onError={(e) => {
             (e.target as HTMLImageElement).style.display = 'none';
           }}
         />

         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide" />
      </div>

      <p className="text-xs font-medium text-gray-400 animate-pulse">Loading...</p>
    </div>
  );
};