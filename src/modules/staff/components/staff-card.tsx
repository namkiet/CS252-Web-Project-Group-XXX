import React from 'react';
import { Facebook, Linkedin } from 'lucide-react';

interface StaffCardProps {
  name: string;
  role: string;
  image: string;
  description: string;
  facebookUrl: string;
  linkedinUrl: string;
}

const StaffCard: React.FC<StaffCardProps> = ({ name, role, image, description, facebookUrl, linkedinUrl }) => {
  return (
    <div className="flex flex-col items-center text-center p-2">
      <div className="w-28 h-28 mb-6 overflow-hidden rounded-full">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-4">{role}</p>

      <p className="text-gray-600 text-sm leading-relaxed mb-6 px-2">
        {description}
      </p>

      <div className="flex gap-3 mt-auto">
        {facebookUrl && (
          <SocialButton 
            icon={<Facebook size={16} />} 
            href={facebookUrl}
            color="bg-[#1877F2]"
          />
        )}
        
        {linkedinUrl && (
          <SocialButton 
            icon={<Linkedin size={16} />} 
            href={linkedinUrl}
            color="bg-[#0A66C2]"
          />
        )}
      </div>
    </div>
  );
};

const SocialButton = ({ icon, href, color }: { icon: React.ReactNode; href: string; color: string }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    className={`w-8 h-8 flex items-center justify-center ${color} text-white rounded-full hover:opacity-90 transition-opacity shadow-sm hover:scale-110 transform duration-200`}
  >
    {icon}
  </a>
);

export default StaffCard;