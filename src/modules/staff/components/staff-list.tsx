import { useTranslation } from 'react-i18next';
import StaffCard from './staff-card';
import { SlideInOnScroll } from '@/shared/components/slideInOnScroll';
import { STAFF_DATA } from './data';

export const StaffList = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 pb-16 md:pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 sm:gap-6">
        {STAFF_DATA.map((staff, index) => (
          <div key={staff.id} style={{ transitionDelay: `${index * 100}ms` }}>
            <SlideInOnScroll>
              <StaffCard
                name={staff.name}
                role={t(staff.role)}
                image={staff.image}
                description={t(staff.description)}
                facebookUrl={staff.facebookUrl}
                linkedinUrl={staff.linkedinUrl}
              />
            </SlideInOnScroll>
          </div>
        ))}
      </div>
    </div>
  );
};