import { useAuth } from 'src/hook/useAuth';
import SidebarContent from './Sidebaritems';
import { uniqueId } from 'lodash';

export const BaseSidebarContent = () => {
  const { user } = useAuth();

  if (!user) return [];

  // Base menus based on login_type
  let baseMenus = SidebarContent[user.login_type] || [];

  // Add extra menus based on academic_type
  const hiddenMenus = {
    // academic_type: 1 → School
    1: ['College Services','College Applications', 'Career Management'],
    2: ['School Services','School Applications', 'Career Management'],
    3: ['School Services','School Applications', 'Career Management'],
    4: ['School Services','School Applications','College Applications','College Services','Transaction', 'Fronted Management']
  };

 let academicMenus = [];

  if (user.login_type === 3) {
    const hiddenItems = hiddenMenus[user.academic_type] || [];

    baseMenus = baseMenus.map((menu) => ({
      ...menu,
      children: menu.children?.filter(
        (child) => !hiddenItems.includes(child.name)
      ),
    }));
  }

    return [...baseMenus, ...academicMenus];
  };




// import { useAuth } from 'src/hook/useAuth';
// import { uniqueId } from 'lodash';

// export const BaseSidebarContent = () => {
//   const { user } = useAuth();
  
//   if (!user) return [];

//   const role = user.role;
//   const academicType = user.academic_type;

//   // Common menu items that can be reused across roles
//   const commonMenus = {
//     dashboard: { name: 'Dashboard', url: `/${role}/dashboard`, icon: 'solar:pie-chart-line-duotone' },
//     profile: { name: 'Profile', url: `/${role}/profile`, icon: 'solar:user-circle-line-duotone' },
//     activity: { name: 'Activity', url: `/${role}/activity`, icon: 'solar:clock-circle-line-duotone' },
//     transaction: { name: 'Transaction', url: `/${role}/transaction`, icon: 'solar:card-transfer-line-duotone' },
//   };

//   // School Services Menu (for academic_type = 1)
//   const schoolServicesMenu = {
//     name: 'School Services',
//     id: uniqueId(),
//     icon: 'solar:backpack-line-duotone',
//     children: [
//       { name: 'Classes', id: uniqueId(), url: `/${role}/classes`, isPro: false },
//       { name: 'Transportation', id: uniqueId(), url: `/${role}/transportation`, isPro: false },
//       { name: 'Setting', id: uniqueId(), url: `/${role}/setting`, isPro: false },
//       { 
//         name: 'Content Management', 
//         id: uniqueId(), 
//         url: `/${role}/school-content-management`, 
//         isPro: false 
//       },
//     ],
//   };

//   // College Services Menu (for academic_type = 2)
//   const collegeServicesMenu = {
//     name: 'College Services',
//     id: uniqueId(),
//     icon: 'solar:backpack-line-duotone',
//     children: [
//       { name: 'Degrees', id: uniqueId(), url: `/${role}/degrees`, isPro: false },
//       { name: 'Hallticket', id: uniqueId(), url: `/${role}/halltickets`, isPro: false },
//       { name: 'Nominal Roll', id: uniqueId(), url: `/${role}/nominal-roll`, isPro: false },
//       { name: 'Rankcard', id: uniqueId(), url: `/${role}/rankcard`, isPro: false },
//       { 
//         name: 'Content Management', 
//         id: uniqueId(), 
//         url: `/${role}/college-content-management`, 
//         isPro: false 
//       },
//     ],
//   };

//   // Role-based menu configurations
//   const roleBasedMenus = {
//     SuperAdmin: [
//       commonMenus.dashboard,
//       {
//         name: 'Accounts',
//         id: uniqueId(),
//         icon: 'solar:widget-line-duotone',
//         children: [
//           { name: 'Demo Accounts', id: uniqueId(), url: '/SuperAdmin/demo-accounts', isPro: false },
//           { name: 'Live Accounts', id: uniqueId(), url: '/SuperAdmin/live-accounts', isPro: false },
//         ],
//       },
//       // {
//       //   name: 'Application Forms',
//       //   id: uniqueId(),
//       //   icon: 'solar:document-line-duotone',
//       //   children: [
//       //     { name: 'School Applications', id: uniqueId(), url: '/SuperAdmin/school-applications', isPro: false },
//       //     { name: 'College Applications', id: uniqueId(), url: '/SuperAdmin/college-applications', isPro: false },
//       //   ],
//       // },
//       // {
//       //   name: 'User Management',
//       //   id: uniqueId(),
//       //   icon: 'solar:users-group-two-rounded-line-duotone',
//       //   children: [
//       //     { name: 'Support Admin', id: uniqueId(), url: '/SuperAdmin/support-admin', isPro: false },
//       //     { name: 'Sales Admin', id: uniqueId(), url: '/SuperAdmin/sales-admin', isPro: false },
//       //     { name: 'Customer Admin', id: uniqueId(), url: '/SuperAdmin/customer-admin', isPro: false },
//       //   ],
//       // },
//       // {
//       //   name: 'Fees Structure',
//       //   id: uniqueId(),
//       //   icon: 'solar:bill-list-line-duotone',
//       //   children: [
//       //     { name: 'Fees', id: uniqueId(), url: '/SuperAdmin/fees', isPro: false },
//       //   ],
//       // },
//       // {
//       //   name: 'Data Manager',
//       //   id: uniqueId(),
//       //   icon: 'solar:database-line-duotone',
//       //   children: [
//       //     { name: 'State', id: uniqueId(), url: '/SuperAdmin/data-manager/State', isPro: false },
//       //     { name: 'District', id: uniqueId(), url: '/SuperAdmin/data-manager/District', isPro: false },
//       //     { name: 'Type Configuration', id: uniqueId(), url: '/SuperAdmin/data-manager/type-configuration', isPro: false },
//       //     { name: 'Type Management', id: uniqueId(), url: '/SuperAdmin/data-manager/type-of-connection', isPro: false },
//       //   ],
//       // },
//       // {
//       //   name: 'Frontend Management',
//       //   id: uniqueId(),
//       //   icon: 'solar:monitor-line-duotone',
//       //   children: [
//       //     { name: 'Home Page', id: uniqueId(), url: '/SuperAdmin/frontend-editing/home', isPro: false },
//       //     { name: 'Footer', id: uniqueId(), url: '/SuperAdmin/frontend-editing/footer', isPro: false },
//       //     { name: 'Popups', id: uniqueId(), url: '/SuperAdmin/frontend-editing/popups', isPro: false },
//       //   ],
//       // },
//       // {
//       //   name: 'Ticket',
//       //   id: uniqueId(),
//       //   icon: 'solar:ticket-line-duotone',
//       //   children: [
//       //     { name: 'Open Ticket', id: uniqueId(), url: '/SuperAdmin/Ticket/open', isPro: false },
//       //     { name: 'Accepted Ticket', id: uniqueId(), url: '/SuperAdmin/Ticket/Accepted', isPro: false },
//       //     { name: 'Resolved Ticket', id: uniqueId(), url: '/SuperAdmin/Ticket/Resolved', isPro: false },
//       //   ],
//       // },
//       // {
//       //   name: 'Campaign',
//       //   id: uniqueId(),
//       //   icon: 'solar:ticket-line-duotone',
//       //   children: [
//       //     { name: 'Template Campaign', id: uniqueId(), url: '/SuperAdmin/campaign/template', isPro: false },
//       //     { name: 'Send Campaign', id: uniqueId(), url: '/SuperAdmin/campaign/send', isPro: false },
//       //     { name: 'Campaign History', id: uniqueId(), url: '/SuperAdmin/campaign/history', isPro: false },
//       //   ],
//       // },
//       // Conditionally add academic services based on academic_type
//       // ...(academicType === 1 ? [schoolServicesMenu] : []),
//       // ...(academicType === 2 ? [collegeServicesMenu] : []),
//       // {
//       //   name: 'Export Data',
//       //   id: uniqueId(),
//       //   icon: 'solar:export-line-duotone',
//       //   children: [
//       //     { name: 'School Data', id: uniqueId(), url: '/SuperAdmin/school-data', isPro: false },
//       //     { name: 'College Data', id: uniqueId(), url: '/SuperAdmin/college-data', isPro: false },
//       //   ],
//       // },
//       // commonMenus.activity,
//       // commonMenus.transaction,
//       // commonMenus.profile,
//     ],

//     CustomerAdmin: [
//       commonMenus.dashboard,
//       // Add CustomerAdmin specific menus here
//       ...(academicType === 1 ? [schoolServicesMenu] : []),
//       ...(academicType === 2 ? [collegeServicesMenu] : []),
//       commonMenus.activity,
//       commonMenus.transaction,
//       commonMenus.profile,
//     ],

//     SupportAdmin: [
//       commonMenus.dashboard,
//       {
//         name: 'Ticket Management',
//         id: uniqueId(),
//         icon: 'solar:ticket-line-duotone',
//         children: [
//           { name: 'All Tickets', id: uniqueId(), url: '/SupportAdmin/tickets', isPro: false },
//           { name: 'My Tickets', id: uniqueId(), url: '/SupportAdmin/my-tickets', isPro: false },
//         ],
//       },
//       commonMenus.activity,
//       commonMenus.profile,
//     ],

//     SalesAdmin: [
//       commonMenus.dashboard,
//       {
//         name: 'Leads',
//         id: uniqueId(),
//         icon: 'solar:users-line-duotone',
//         children: [
//           { name: 'All Leads', id: uniqueId(), url: '/SalesAdmin/leads', isPro: false },
//           { name: 'Follow Ups', id: uniqueId(), url: '/SalesAdmin/follow-ups', isPro: false },
//         ],
//       },
//       commonMenus.activity,
//       commonMenus.profile,
//     ],
//   };

//   // Get menus based on user role
//   const getMenusByRole = () => {
//     const menus = roleBasedMenus[role] || [];
    
//     return [
//       {
//         heading: 'Home',
//         children: menus,
//       },
//     ];
//   };

//   // return getMenusByRole();
//   return getMenusByRole();
// };