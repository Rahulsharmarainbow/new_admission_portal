import React, { useState } from "react";
import { Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
import NavItems from "./NavItems";
import SimpleBar from "simplebar-react";
import FullLogo from "../shared/logo/FullLogo";
import NavCollapse from "./NavCollapse";
import SidebarContent from "./Sidebaritems";
import { useAuth } from "src/hook/useAuth";

const SidebarLayout = () => {
  const { user } = useAuth();
  const SidebarContents = SidebarContent[user?.login_type] || [];
  const [activeCollapse, setActiveCollapse] = useState<string | null>(null); // Track which dropdown open

  return (
    <div className="xl:block hidden">
      <Sidebar
        className="fixed menu-sidebar bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0 top-[2px]"
        aria-label="Sidebar with multi-level dropdown example"
      >
        <div className="px-5 py-4 flex items-center sidebarlogo">
          <FullLogo />
        </div>

        <SimpleBar className="h-[calc(100vh_-_94px)]">
          <SidebarItems className="mt-2">
            <SidebarItemGroup className="sidebar-nav hide-menu">
              {SidebarContents?.map((item, index) => (
                <div className="caption" key={item.heading}>
                  {item.children?.map((child, index) => (
                    <React.Fragment key={child.id || index}>
                      {child.children ? (
                        <div className="collpase-items">
                          <NavCollapse
                            item={child}
                            activeCollapse={activeCollapse}
                            setActiveCollapse={setActiveCollapse}
                          />
                        </div>
                      ) : (
                        <NavItems item={child} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </SidebarItemGroup>
          </SidebarItems>
        </SimpleBar>
      </Sidebar>
    </div>
  );
};

export default SidebarLayout;
