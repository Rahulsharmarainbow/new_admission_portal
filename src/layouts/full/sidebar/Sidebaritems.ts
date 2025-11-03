import { uniqueId } from 'lodash';

interface ChildItem {
  name: string;
  url?: string;
  id?: string;
  icon?: string;
  isPro?: boolean;
  children?: ChildItem[];
}

interface MenuItems {
  name: string;
  url?: string;
  id?: string;
  icon?: string;
  isPro?: boolean;
  children?: ChildItem[];
}

interface MenuItem {
  children?: MenuItems[];
  heading?: string;
}

const SidebarContent: Record<number, MenuItem[]> = {
 
    1: [
    {
      heading: 'Home',
      children: [
        { name: 'Dashboard', url: '/SuperAdmin/dashboard', icon: 'solar:pie-chart-line-duotone' },
        {
          name: 'Accounts',
          id: uniqueId(),
          icon: 'solar:widget-line-duotone',
          children: [
            {
              name: 'Demo Accounts',
              id: uniqueId(),
              url: '/SuperAdmin/demo-accounts',
              isPro: false,
            },
            {
              name: 'Live Accounts',
              id: uniqueId(),
              url: '/SuperAdmin/live-accounts',
              isPro: false,
            },
          ],
        },
        {
          name: 'Application Forms',
          id: uniqueId(),
          icon: 'solar:document-line-duotone',
          children: [
            {
              name: 'School Applications',
              id: uniqueId(),
              url: '/SuperAdmin/school-applications',
              isPro: false,
            },
            {
              name: 'College Applications',
              id: uniqueId(),
              url: '/SuperAdmin/college-applications',
              isPro: false,
            },
          ],
        },
        {
          name: 'User Management',
          id: uniqueId(),
          icon: 'solar:users-group-two-rounded-line-duotone',
          children: [
            {
              name: 'Support Admin',
              id: uniqueId(),
              url: '/SuperAdmin/support-admin',
              isPro: false,
            },
            {
              name: 'Sales Admin',
              id: uniqueId(),
              url: '/SuperAdmin/sales-admin',
              isPro: false,
            },
            {
              name: 'Customer Admin',
              id: uniqueId(),
              url: '/SuperAdmin/customer-admin',
              isPro: false,
            },
          ],
        },

        {
          name: 'Fees Structure',
          id: uniqueId(),
          icon: 'solar:bill-list-line-duotone',
          children: [
            {
              name: 'Fees',
              id: uniqueId(),
              url: '/SuperAdmin/fees',
              isPro: false,
            },
          ],
        },

        {
          name: 'Data Manager',
          id: uniqueId(),
          icon: 'solar:database-line-duotone',
          children: [
            {
              name: 'State',
              id: uniqueId(),
              url: '/SuperAdmin/data-manager/State',
              isPro: false,
            },
            {
              name: 'District',
              id: uniqueId(),
              url: '/SuperAdmin/data-manager/District',
              isPro: false,
            },
            {
              name: 'Type Configuration',
              id: uniqueId(),
              url: '/SuperAdmin/data-manager/type-configuration',
              isPro: false,
            },
            {
              name: 'Type Management',
              id: uniqueId(),
              url: '/SuperAdmin/data-manager/type-of-connection',
              isPro: false,
            },
          ],
        },

        {
          name: 'Fronted Management',
          id: uniqueId(),
          icon: 'solar:monitor-line-duotone',
          children: [
            {
              name: 'Home Page',
              id: uniqueId(),
              url: '/SuperAdmin/frontend-editing/home',
              isPro: false,
            },
            {
              name: 'Footer',
              id: uniqueId(),
              url: '/SuperAdmin/frontend-editing/footer',
              isPro: false,
            },
            {
              name: 'Popups',
              id: uniqueId(),
              url: '/SuperAdmin/frontend-editing/popups',
              isPro: false,
            },
          ],
        },

        {
          name: 'Ticket',
          id: uniqueId(),
          icon: 'solar:ticket-line-duotone',
          children: [
            {
              name: 'Open Ticket',
              id: uniqueId(),
              url: '/SuperAdmin/Ticket/open',
              isPro: false,
            },
            {
              name: 'Accepted Ticket',
              id: uniqueId(),
              url: '/SuperAdmin/Ticket/Accepted',
              isPro: false,
            },
            {
              name: 'Resolved Ticket',
              id: uniqueId(),
              url: '/SuperAdmin/Ticket/Resolved',
              isPro: false,
            },
          ],
        },
        {
          name: 'Campaign',
          id: uniqueId(),
          icon: 'solar:ticket-line-duotone',
          children: [
            {
              name: 'Template Campaign',
              id: uniqueId(),
              url: '/SuperAdmin/campaign/template',
              isPro: false,
            },
            {
              name: 'Send Campaign',
              id: uniqueId(),
              url: '/SuperAdmin/campaign/send',
              isPro: false,
            },
            {
              name: 'Campaign History',
              id: uniqueId(),
              url: '/SuperAdmin/campaign/history',
              isPro: false,
            },
          ],
        },
        {
          name: 'School Services',
          id: uniqueId(),
          icon: 'solar:backpack-line-duotone',
          children: [
            {
              name: 'Classes',
              id: uniqueId(),
              url: '/SuperAdmin/classes',
              isPro: false,
            },
            {
              name: 'Transportation',
              id: uniqueId(),
              url: '/SuperAdmin/transportation',
              isPro: false,
            },
            {
              name: 'Setting',
              id: uniqueId(),
              url: '/SuperAdmin/setting',
              isPro: false,
            },
            {
              name: 'Content Management',
              id: uniqueId(),
              url: '/SuperAdmin/school-content-Management',
              isPro: false,
            },
          ],
        },
        {
          name: 'College Services',
          id: uniqueId(),
          icon: 'solar:backpack-line-duotone',
          children: [
            {
              name: 'Degrees',
              id: uniqueId(),
              url: '/SuperAdmin/degrees',
              isPro: false,
            },
            {
              name: 'Hallticket',
              id: uniqueId(),
              url: '/SuperAdmin/halltickets',
              isPro: false,
            },
            {
              name: 'Nominal Roll',
              id: uniqueId(),
              url: '/SuperAdmin/nominal-roll',
              isPro: false,
            },
            {
              name: 'Rankcard',
              id: uniqueId(),
              url: '/SuperAdmin/rankcard',
              isPro: false,
            },
            {
              name: 'Content Management',
              id: uniqueId(),
              url: '/SuperAdmin/college-content-Management',
              isPro: false,
            },
          ],
        },
        {
          name: 'Export Data',
          id: uniqueId(),
          icon: 'solar:export-line-duotone',
          children: [
            {
              name: 'School Data',
              id: uniqueId(),
              url: '/SuperAdmin/school-data',
              isPro: false,
            },
            {
              name: 'College Data',
              id: uniqueId(),
              url: '/SuperAdmin/college-data',
              isPro: false,
            },
          ],
        },
        { name: 'Activity', url: '/SuperAdmin/activity', icon: 'solar:clock-circle-line-duotone' },
        {
          name: 'Transaction',
          url: '/SuperAdmin/transaction',
          icon: 'solar:card-transfer-line-duotone',
        },
        { name: 'Profile', url: '/SuperAdmin/profile', icon: 'solar:user-circle-line-duotone' },
      ],
    },
  ],

  2: [
    // SupportAdmin Menu
    {
      heading: 'Home',
      children: [
        { name: 'Dashboard', url: '/SupportAdmin/dashboard', icon: 'solar:pie-chart-line-duotone' },
        {
          name: 'Accounts',
          id: uniqueId(),
          icon: 'solar:user-id-line-duotone',
          children: [
            {
              name: 'Demo Accounts',
              id: uniqueId(),
              url: '/SupportAdmin/demo-accounts',
              isPro: false,
            },
            {
              name: 'Live Accounts',
              id: uniqueId(),
              url: '/SupportAdmin/live-accounts',
              isPro: false,
            },
          ],
        },
        {
          name: 'School Services',
          id: uniqueId(),
          icon: 'solar:user-id-line-duotone',
          children: [
            {
              name: 'Classes',
              id: uniqueId(),
              url: '/SupportAdmin/classes',
              isPro: false,
            },
            {
              name: 'Transportation',
              id: uniqueId(),
              url: '/SupportAdmin/transportation',
              isPro: false,
            },
            {
              name: 'Setting',
              id: uniqueId(),
              url: '/SupportAdmin/setting',
              isPro: false,
            },
            {
              name: 'Content Management',
              id: uniqueId(),
              url: '/SupportAdmin/content-Management',
              isPro: false,
            },
          ],
        },
        {
          name: 'Ticket',
          id: uniqueId(),
          icon: 'solar:ticket-line-duotone',
          children: [
            {
              name: 'Open Ticket',
              id: uniqueId(),
              url: '/SupportAdmin/Ticket/open',
              isPro: false,
            },
            {
              name: 'Accepted Ticket',
              id: uniqueId(),
              url: '/SupportAdmin/Ticket/Accepted',
              isPro: false,
            },
            {
              name: 'Resolved Ticket',
              id: uniqueId(),
              url: '/SupportAdmin/Ticket/Resolved',
              isPro: false,
            },
          ],
        },
        {
          name: 'College Services',
          id: uniqueId(),
          icon: 'solar:user-id-line-duotone',
          children: [
            {
              name: 'Degrees',
              id: uniqueId(),
              url: '/SupportAdmin/degrees',
              isPro: false,
            },
            {
              name: 'Hallticket',
              id: uniqueId(),
              url: '/SupportAdmin/halltickets',
              isPro: false,
            },
            {
              name: 'Nominal Roll',
              id: uniqueId(),
              url: '/SupportAdmin/nominal-roll',
              isPro: false,
            },
            {
              name: 'Rankcard',
              id: uniqueId(),
              url: '/SupportAdmin/rankcard',
              isPro: false,
            },
            {
              name: 'Content Management',
              id: uniqueId(),
              url: '/SupportAdmin/content-Management',
              isPro: false,
            },
          ],
        },
        {
          name: 'User Management',
          id: uniqueId(),
          icon: 'solar:user-id-line-duotone',
          children: [
            {
              name: 'Sales Admin',
              id: uniqueId(),
              url: '/SupportAdmin/sales-admin',
              isPro: false,
            },
            {
              name: 'Customer Admin',
              id: uniqueId(),
              url: '/SupportAdmin/customer-admin',
              isPro: false,
            },
          ],
        },

        {
          name: 'Fees Structure',
          id: uniqueId(),
          icon: 'solar:cardholder-line-duotone',
          children: [
            {
              name: 'Fees',
              id: uniqueId(),
              url: '/SupportAdmin/fees',
              isPro: false,
            },
          ],
        },

        {
          name: 'Data Manager',
          id: uniqueId(),
          icon: 'solar:database-line-duotone',
          children: [
            {
              name: 'State',
              id: uniqueId(),
              url: '/SupportAdmin/data-manager/State',
              isPro: false,
            },
            {
              name: 'District',
              id: uniqueId(),
              url: '/SupportAdmin/data-manager/District',
              isPro: false,
            },
            {
              name: 'Type Configuration',
              id: uniqueId(),
              url: '/SupportAdmin/data-manager/type-configuration',
              isPro: false,
            },
            {
              name: 'Type Management',
              id: uniqueId(),
              url: '/SupportAdmin/data-manager/type-of-connection',
              isPro: false,
            },
          ],
        },
        { name: 'Profile', url: '/SupportAdmin/profile', icon: 'solar:user-id-line-duotone' },
      ],
    },
  ],
  3: [
    // CustomerAdmin Menu
    {
      heading: 'Home',
      children: [
        {
          name: 'Dashboard',
          url: '/CustomerAdmin/dashboard',
          icon: 'solar:pie-chart-line-duotone',
        },
        {
          name: 'School Applications',
          url: '/CustomerAdmin/school-applications',
          icon: 'solar:pie-chart-line-duotone',
        },
        {
          name: 'College Applications',
          url: '/CustomerAdmin/college-applications',
          icon: 'solar:pie-chart-line-duotone',
        },
        {
          name: 'School Services',
          id: uniqueId(),
          icon: 'solar:user-id-line-duotone',
          children: [
            {
              name: 'Classes',
              id: uniqueId(),
              url: '/CustomerAdmin/classes',
              isPro: false,
            },
            {
              name: 'Transportation',
              id: uniqueId(),
              url: '/CustomerAdmin/transportation',
              isPro: false,
            },
            {
              name: 'Setting',
              id: uniqueId(),
              url: '/CustomerAdmin/setting',
              isPro: false,
            },
            {
              name: 'Content Management',
              id: uniqueId(),
              url: '/CustomerAdmin/school-content-Management',
              isPro: false,
            },
          ],
        },
        {
          name: 'College Services',
          id: uniqueId(),
          icon: 'solar:user-id-line-duotone',
          children: [
            {
              name: 'Degrees',
              id: uniqueId(),
              url: '/CustomerAdmin/degrees',
              isPro: false,
            },
            {
              name: 'Hallticket',
              id: uniqueId(),
              url: '/CustomerAdmin/halltickets',
              isPro: false,
            },
            {
              name: 'Nominal Roll',
              id: uniqueId(),
              url: '/CustomerAdmin/nominal-roll',
              isPro: false,
            },
            {
              name: 'Rankcard',
              id: uniqueId(),
              url: '/CustomerAdmin/rankcard',
              isPro: false,
            },
            {
              name: 'Content Management',
              id: uniqueId(),
              url: '/CustomerAdmin/college-content-Management',
              isPro: false,
            },
          ],
        },
         {
          name: 'Transaction',
          url: '/CustomerAdmin/transaction',
          icon: 'solar:card-transfer-line-duotone',
        },
        {
          name: 'Data Manager',
          id: uniqueId(),
          icon: 'solar:database-line-duotone',
          children: [
            {
              name: 'State',
              id: uniqueId(),
              url: '/CustomerAdmin/data-manager/State',
              isPro: false,
            },
            {
              name: 'District',
              id: uniqueId(),
              url: '/CustomerAdmin/data-manager/District',
              isPro: false,
            },
            {
              name: 'Type Configuration',
              id: uniqueId(),
              url: '/CustomerAdmin/data-manager/type-configuration',
              isPro: false,
            },
            {
              name: 'Type Management',
              id: uniqueId(),
              url: '/CustomerAdmin/data-manager/type-of-connection',
              isPro: false,
            },
          ],
        },
        // ...(useAuth().user?.academic_type === 1
        //   ? [
        //       {
        //         name: 'School Services',
        //         id: uniqueId(),
        //         icon: 'solar:user-id-line-duotone',
        //         children: [
        //           {
        //             name: 'Classes',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/classes',
        //             isPro: false,
        //           },
        //           {
        //             name: 'Transportation',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/transportation',
        //             isPro: false,
        //           },
        //           {
        //             name: 'Setting',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/setting',
        //             isPro: false,
        //           },
        //           {
        //             name: 'Content Management',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/content-Management',
        //             isPro: false,
        //           },
        //         ],
        //       },
        //     ]
        //   : []),
        // ...(useAuth().user?.academic_type === 2
        //   ? [
        //       {
        //         name: 'College Services',
        //         id: uniqueId(),
        //         icon: 'solar:user-id-line-duotone',
        //         children: [
        //           {
        //             name: 'Degrees',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/degrees',
        //             isPro: false,
        //           },
        //           {
        //             name: 'Hallticket',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/halltickets',
        //             isPro: false,
        //           },
        //           {
        //             name: 'Nominal Roll',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/nominal-roll',
        //             isPro: false,
        //           },
        //           {
        //             name: 'Rankcard',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/rankcard',
        //             isPro: false,
        //           },
        //           {
        //             name: 'Content Management',
        //             id: uniqueId(),
        //             url: '/CustomerAdmin/content-Management',
        //             isPro: false,
        //           },
        //         ],
        //       },
        //     ]
        //   : []),
        {
          name: 'Ticket',
          id: uniqueId(),
          icon: 'solar:ticket-line-duotone',
          children: [
            {
              name: 'Open Ticket',
              id: uniqueId(),
              url: '/CustomerAdmin/Ticket/open',
              isPro: false,
            },
            {
              name: 'Accepted Ticket',
              id: uniqueId(),
              url: '/CustomerAdmin/Ticket/Accepted',
              isPro: false,
            },
            {
              name: 'Resolved Ticket',
              id: uniqueId(),
              url: '/CustomerAdmin/Ticket/Resolved',
              isPro: false,
            },
          ],
        },
        { name: 'Profile', url: '/CustomerAdmin/profile', icon: 'solar:user-id-line-duotone' },
      ],
    },
  ],
  4: [
    // SalesAdmin Menu
    {
      heading: 'Home',
      children: [
        { name: 'Dashboard', url: '/SalesAdmin/dashboard', icon: 'solar:pie-chart-line-duotone' },
        {
          name: 'Accounts',
          id: uniqueId(),
          icon: 'solar:user-id-line-duotone',
          children: [
            {
              name: 'Demo Accounts',
              id: uniqueId(),
              url: '/SalesAdmin/demo-accounts',
              isPro: false,
            },
            {
              name: 'Live Accounts',
              id: uniqueId(),
              url: '/SalesAdmin/live-accounts',
              isPro: false,
            },
          ],
        },
        { name: 'Profile', url: '/SalesAdmin/profile', icon: 'solar:user-id-line-duotone' },
      ],
    },
  ],
};

export default SidebarContent;

// export interface ChildItem {
//   id?: number | string;
//   name?: string;
//   icon?: any;
//   children?: ChildItem[];
//   item?: any;
//   url?: any;
//   color?: string;
//   isPro?: boolean;
// }

// export interface MenuItem {
//   heading?: string;
//   name?: string;
//   icon?: any;
//   id?: number;
//   to?: string;
//   items?: MenuItem[];
//   children?: ChildItem[];
//   url?: any;
//   isPro?: boolean;
// }

// import { uniqueId } from 'lodash';

// const SidebarContent: MenuItem[] = [
//   {
//     heading: 'Home',
//     children: [
//       {
//         name: 'Dashboard',
//         icon: 'solar:pie-chart-line-duotone',
//         id: uniqueId(),
//         url: '/',
//         isPro: false,
//       },
//     ],
//   },
//   {
//     heading: 'Apps',
//     children: [
//       {
//         name: 'Accounts',
//         id: uniqueId(),
//         icon: 'solar:user-id-line-duotone',
//         children: [
//           {
//             name: 'Demo Accounts',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Live Accounts',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'Application Form',
//         id: uniqueId(),
//         icon: 'solar:document-add-line-duotone',
//         children: [
//           {
//             name: 'School Application',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'College Application',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'Campaign',
//         id: uniqueId(),
//         icon: 'solar:chat-round-line-duotone',
//         children: [
//           {
//             name: 'Templates Onboarding',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Send Campaign',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           },
//           {
//             name: 'Campaign Record',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'Fee Structure',
//         icon: 'solar:cardholder-line-duotone',
//         id: uniqueId(),
//         url: '/ui/buttons',
//         isPro: false,
//       },
//       {
//         name: 'Export Data',
//         id: uniqueId(),
//         icon: 'solar:export-line-duotone',
//         children: [
//           {
//             name: 'School Data',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'College Data',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'Frontend Editing',
//         id: uniqueId(),
//         icon: 'solar:code-square-line-duotone',
//         children: [
//           {
//             name: 'Home Editing',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Footer Editing',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           },
//           {
//             name: 'Popup Editing',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'Ticket',
//         id: uniqueId(),
//         icon: 'solar:ticket-line-duotone',
//         children: [
//           {
//             name: 'Open Ticket',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Accepted Ticket',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           },
//           {
//             name: 'Resolved Ticket',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'Transaction',
//         icon: 'solar:card-transfer-line-duotone',
//         id: uniqueId(),
//         url: '/ui/buttons',
//         isPro: false,
//       },
//       {
//         name: 'Admin',
//         id: uniqueId(),
//         icon: 'solar:shield-user-line-duotone',
//         children: [
//           {
//             name: 'Super Admin',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Sales Admin',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           },
//           {
//             name: 'Support Admin',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           },
//           {
//             name: 'Customer Admin',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           },
//         ],
//       },
//       {
//         name: 'Activity Log',
//         icon: 'solar:clipboard-list-line-duotone',
//         id: uniqueId(),
//         url: '/ui/buttons',
//         isPro: false,
//       },
//       {
//         name: 'School Services',
//         id: uniqueId(),
//         icon: 'solar:home-smile-angle-line-duotone',
//         children: [
//           {
//             name: 'Classes',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Transportation',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Setting',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Content Managment',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'College Services',
//         id: uniqueId(),
//         icon: 'solar:backpack-line-duotone',
//         children: [
//           {
//             name: 'Degrees',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Halltickets',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Nominal Roll',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Rankcard',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Content Managment',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'Data Manager',
//         id: uniqueId(),
//         icon: 'solar:database-line-duotone',
//         children: [
//           {
//             name: 'State',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'District',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Gender',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Blood Group',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Boards',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Cast',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Income',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Local Area',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Special Category',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/homepage',
//             isPro: false,
//           },
//           {
//             name: 'Year',
//             id: uniqueId(),
//             url: 'https://spike-react-tailwind-main.netlify.app/frontend-pages/aboutus',
//             isPro: false,
//           }
//         ],
//       },
//       {
//         name: 'Profile',
//         icon: 'solar:user-circle-line-duotone',
//         id: uniqueId(),
//         url: '/ui/buttons',
//         isPro: false,
//       },
//     ],
//   },
// ];

// export default SidebarContent;
