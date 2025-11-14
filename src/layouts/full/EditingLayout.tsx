import { FC, useState } from 'react';
import { Outlet } from 'react-router';

import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

const EditingLayout: FC = () => {
   const [activeCollapse, setActiveCollapse] = useState<string | null>(null);
  return (
    <>
     <div className="flex w-full min-w-0">
      
      
      
          <Outlet />
      
      
      </div>
    </>
  );
};

export default EditingLayout;

