import { defineStore } from 'pinia';
import { UserStoreData } from './types';
import { useAbility } from '@casl/vue';
import { AppAbility } from '@/plugins/casl/AppAbility';
import { initialAbilityValue } from '@/plugins/casl/AppAbility';
import { loginService } from '@/services/login';
import { creditLimitService } from '@/services/creditLimit';

import { getStoredUser, removeStoredUser, setStoredUser } from '@/utils/user';
import { addSeconds } from 'date-fns';
import {
  LoginPayload,
  LoginResponse,
  LoginSubject,
} from '@/services/login/types';

import { logoutService } from '@/services/logout';
import { metaPurchaseService } from '@/services/metaPurchase';
import { MetaPurchaseResponse } from '@/services/metaPurchase/types';

export const useUserStore = defineStore('UserStore', () => {
  const userData = ref<UserStoreData>();
  const abilities = useAbility<AppAbility>();
  const router = useRouter();
  const route = useRoute();

  const isAdmin = computed(() => userData.value?.role == 'admin');
  const isClient = computed(() => userData.value?.role == 'client');

  function getPurchaseData() {
    const id = userData.value?.user?.cdPessoa;
    if (id) {
      const request = metaPurchaseService(id).get().json();

      request.execute(true).then(() => {
        if (userData.value) {
          const data: MetaPurchaseResponse = request.data.value;

          setUserData({
            sales: {
              buyed: data?.vlTotalCompra,
              goal: data?.vlMetaCompra,
            },
          });
        }
      });
    }
  }

  function login(subject: LoginSubject, payload: LoginPayload) {
    const request = loginService(subject).post(payload).json();

    request
      .execute(true)
      .then(() => {
        const data = request.data.value as LoginResponse;

        setAbilities([{ action: 'all', subject: subject }]);

        setUserData({ ...data, role: subject }, true);

        router.replace(route.query.to ? String(route.query.to) : '/');
      })
      .catch(() => {});

    return { request };
  }

  function logout() {
    logoutService()
      .get()
      .json()
      .execute(true)
      .then(() => {
        clear();
        router.push(isAdmin ? '/login-admin' : '/login');
      });
  }

  function setUserData(
    data: UserStoreData,
    updateToken = false,
    persist = true,
  ) {
    userData.value = { ...getStoredUser(), ...data };

    if (updateToken && data.token) {
      const lastFetchedDate = new Date();
      const dateToExpire = addSeconds(lastFetchedDate, data.token.expiresIn);
      userData.value.token = { ...data.token, dateToExpire, lastFetchedDate };
    }

    if (persist) {
      setStoredUser(userData.value);
    }
  }

  function setAbilities(rules: AppAbility['rules'], persist = true) {
    abilities.update(rules);

    if (persist) {
      localStorage.setItem('userAbilities', JSON.stringify(rules));
    }
  }

  function syncUserWithStoredUser() {
    const storedUser = getStoredUser();
    if (storedUser) {
      userData.value = storedUser;

      // getPurchaseData();
    }
  }

  function clear(target: 'user' | 'abilities' | 'all' = 'all') {
    const options: Record<typeof target, () => void> = {
      abilities: () => {
        abilities.update(initialAbilityValue);
        localStorage.removeItem('userAbilities');
      },

      user: () => {
        userData.value = undefined;

        removeStoredUser();
      },
      all: () => {
        options.abilities();
        options.user();
      },
    };

    return options[target]();
  }

  onBeforeMount(() => {
    syncUserWithStoredUser();
  });

  return {
    userData,
    isAdmin,
    clear,
    login,
    logout,
    abilities,
    isClient,

    ...creditLimitService(),
  };
});
