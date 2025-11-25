import React from 'react';
import { StaffHeader } from '../components/staff-header';
import { StaffList } from '../components/staff-list';
import { StaffBanner } from '../components/staff-banner';

const StaffPage: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <StaffHeader />
      <StaffList />
      <StaffBanner />
    </div>
  );
};

export default StaffPage;