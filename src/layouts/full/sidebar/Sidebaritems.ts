
import { uniqueId } from 'lodash';

const SidebarContent: Record<number, MenuItem[]> = {
  1: [ // SuperAdmin Menu
    {
      heading: "Home",
      children: [
        { name: "Dashboard", url: "/SuperAdmin/dashboard", icon: "solar:pie-chart-line-duotone" },
        // { name: "Manage Users", url: "/SuperAdmin/users", icon: "solar:user-id-line-duotone" },
      ],
    },
      {
    heading: 'Apps',
    children: [
      {
        name: 'Accounts',
        id: uniqueId(),
        icon: 'solar:user-id-line-duotone',
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
          }
        ],
      },
      {
        name: 'User Management',
        id: uniqueId(),
        icon: 'solar:user-id-line-duotone',
        children: [
          // {
          //   name: 'Super Admin',
          //   id: uniqueId(),
          //   url: '/SuperAdmin/admin',
          //   isPro: false,
          // },
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
          }
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
              url: '/SuperAdmin/fees',
              isPro: false,
            },
          ],
        },
      
      { name: "Profile", url: "/SuperAdmin/profile", icon: "solar:user-id-line-duotone" },

    ]
    },

  ],

  
  2: [ // SupportAdmin Menu
    {
      heading: "Home",
      children: [
        { name: "Dashboard", url: "/SupportAdmin/dashboard", icon: "solar:pie-chart-line-duotone" },

      ],
    },
     {
    heading: 'Apps',
    children: [
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
          }
        ],
      },
      // {
      //   name: 'User Management',
      //   id: uniqueId(),
      //   icon: 'solar:user-id-line-duotone',
      //   children: [
      //     // {
      //     //   name: 'Super Admin',
      //     //   id: uniqueId(),
      //     //   url: '/SuperAdmin/admin',
      //     //   isPro: false,
      //     // },
      //     {
      //       name: 'Support Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/support-admin',
      //       isPro: false,
      //     },
      //     {
      //       name: 'Sales Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/sales-admin',
      //       isPro: false,
      //     },
      //     {
      //       name: 'Customer Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/customer-admin',
      //       isPro: false,
      //     }
      //   ],
      // },
               { name: "Profile", url: "/SupportAdmin/profile", icon: "solar:user-id-line-duotone" },

    ]
    },
    
  ],
  4: [ // SalesAdmin Menu
    {
      heading: "Home",
      children: [
        { name: "Dashboard", url: "/SalesAdmin/dashboard", icon: "solar:pie-chart-line-duotone" },

      ],
    },
     {
    heading: 'Apps',
    children: [
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
          }
        ],
      },
      // {
      //   name: 'User Management',
      //   id: uniqueId(),
      //   icon: 'solar:user-id-line-duotone',
      //   children: [
      //     // {
      //     //   name: 'Super Admin',
      //     //   id: uniqueId(),
      //     //   url: '/SuperAdmin/admin',
      //     //   isPro: false,
      //     // },
      //     {
      //       name: 'Support Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/support-admin',
      //       isPro: false,
      //     },
      //     {
      //       name: 'Sales Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/sales-admin',
      //       isPro: false,
      //     },
      //     {
      //       name: 'Customer Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/customer-admin',
      //       isPro: false,
      //     }
      //   ],
      // },
               { name: "Profile", url: "/SalesAdmin/profile", icon: "solar:user-id-line-duotone" },

    ]
    },
  ],
  3: [ // CustomerAdmin Menu
    {
      heading: "Home",
      children: [
        { name: "Dashboard", url: "/CustomerAdmin/dashboard", icon: "solar:pie-chart-line-duotone" },

      ],
    },
     {
    heading: 'Apps',
    children: [
      {
        name: 'Accounts',
        id: uniqueId(),
        icon: 'solar:user-id-line-duotone',
        children: [
          {
            name: 'Demo Accounts',
            id: uniqueId(),
            url: '/CustomerAdmin/demo-accounts',
            isPro: false,
          },
          {
            name: 'Live Accounts',
            id: uniqueId(),
            url: '/CustomerAdmin/live-accounts',
            isPro: false,
          }
        ],
      },
      // {
      //   name: 'User Management',
      //   id: uniqueId(),
      //   icon: 'solar:user-id-line-duotone',
      //   children: [
      //     // {
      //     //   name: 'Super Admin',
      //     //   id: uniqueId(),
      //     //   url: '/SuperAdmin/admin',
      //     //   isPro: false,
      //     // },
      //     {
      //       name: 'Support Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/support-admin',
      //       isPro: false,
      //     },
      //     {
      //       name: 'Sales Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/sales-admin',
      //       isPro: false,
      //     },
      //     {
      //       name: 'Customer Admin',
      //       id: uniqueId(),
      //       url: '/SuperAdmin/customer-admin',
      //       isPro: false,
      //     }
      //   ],
      // },
               { name: "Profile", url: "/CustomerAdmin/profile", icon: "solar:user-id-line-duotone" },

    ]
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