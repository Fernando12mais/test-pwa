import { setupLayouts } from 'virtual:generated-layouts';

import { createRouter, createWebHistory } from 'vue-router';
import { isUserLoggedIn } from './utils';
import routes from '~pages';

import { canNavigate } from '@layouts/plugins/casl';
import { UserStoreData } from '@/stores/useUserStore/types';

import { getStoredUser, updateUserToken } from '@/utils/user';
import { useUserConfigStore } from '@/stores/useUserConfigStore';

const router = createRouter({
  history: createWebHistory('./'),

  routes: [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
      path: '/',
      redirect: to => {
        const userData = localStorage.getItem('userData');

        if (userData) {
          const parsedData: UserStoreData = JSON.parse(userData);

          if (parsedData?.role == 'admin') return { name: 'admin' };

          if (parsedData.role == 'client') return { name: 'client' };
          return { name: 'login' };
        }

        return { name: 'login', query: to.query };
      },
    },

    ...setupLayouts(routes),
  ],
});

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach(to => {
  const isLoggedIn = isUserLoggedIn();

  const configStore = useUserConfigStore();
  const { config } = storeToRefs(configStore);

  if (config.value) {
    useHeadSafe({
      title: () => `${config.value?.title}`,
      link: [
        {
          rel: 'icon',
          href: config.value?.images?.favicon || '',
        },
      ],
    });
  } else {
    useHeadSafe({
      title: `Alfa-B2B`,
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
      ],
    });
  }

  if (canNavigate(to)) {
    if (isLoggedIn) {
      const storedUser = getStoredUser();

      if (storedUser?.token?.dateToExpire) {
        updateUserToken(new Date(storedUser.token.dateToExpire), storedUser);
      }
    }
    if (isLoggedIn && to.meta.redirectIfLoggedIn) return '/';
  } else {
    if (isLoggedIn) return { name: 'not-authorized' };
    return '/';
  }
});

export default router;
