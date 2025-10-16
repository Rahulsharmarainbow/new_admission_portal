import React from 'react';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import ContentTable from './components/ContentTable';
import { useAuth } from 'src/hook/useAuth';

const CollegeContentList: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6">
      <BreadcrumbHeader
        title="Content Management"
        paths={[{ name: "Content", link: "#" }]}
      />
      <ContentTable />
    </div>
  );
};

export default CollegeContentList;