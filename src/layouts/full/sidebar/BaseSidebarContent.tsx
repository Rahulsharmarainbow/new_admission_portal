import { useAuth } from 'src/hook/useAuth';
import SidebarContent from './Sidebaritems';
import { uniqueId } from 'lodash';

export const BaseSidebarContent = () => {
  const { user } = useAuth();

  if (!user) return [];

  // Base menus based on login_type
  const baseMenus = SidebarContent[user.login_type] || [];

  // Add extra menus based on academic_type
  const academicMenus =
    user.academic_type === 1
      ? [
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
                    url: '/CustomerAdmin/content-Management',
                    isPro: false,
                  },
                ],
              },
            ]
      : user.academic_type === 2
      ? [
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
                    url: '/CustomerAdmin/content-Management',
                    isPro: false,
                  },
                ],
              },
            ]
      : [];

  return [...baseMenus, ...academicMenus];
};
