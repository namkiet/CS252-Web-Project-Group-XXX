import StaffCard from './staff-card';
import { SlideInOnScroll } from '@/shared/components/slideInOnScroll';
import { STAFF_DATA } from './data';

export const StaffList = () => {
  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAFF_DATA.map((staff, index) => (
          <div key={staff.id} style={{ transitionDelay: `${index * 100}ms` }}>
            <SlideInOnScroll>
              <StaffCard
                name={staff.name}
                role={staff.role}
                image={staff.image}
                description={staff.description}
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