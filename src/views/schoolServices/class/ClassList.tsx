import React from 'react';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import ClassTable from './components/ClassTable';
import { useAuth } from 'src/hook/useAuth';

const ClassList: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6">
      <BreadcrumbHeader
        title="Class Management"
        paths={[{ name: "Classes", link: "/" + user?.role + "/classes" }]}
      />
      <ClassTable />
    </div>
  );
};

export default ClassList;