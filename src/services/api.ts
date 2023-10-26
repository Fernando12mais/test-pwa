import router from '@/router';

import {
  clearUser,
  getStoredUser,
  setStoredUser,
  updateUserToken,
} from '@/utils/user';

import { UseFetchOptions, createFetch } from '@vueuse/core';
import { TokenResponse } from './token/types';
import { addSeconds } from 'date-fns';
import { useToastStore } from '@/stores/useToastStore';
import i18n from '@/plugins/i18n';
import axios from 'axios';

const token = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  timeout: 20000,
});
let cachedToken: TokenResponse;
let isFetchingToken = false;

async function getToken() {
  if (cachedToken) {
    return cachedToken; // Return cached token if available
  }

  if (isFetchingToken) {
    await new Promise(resolve => {
      // If token is being fetched by another call, wait for it to finish
      const checkTokenInterval = setInterval(() => {
        if (!isFetchingToken) {
          clearInterval(checkTokenInterval);
          resolve(0);
        }
      }, 100);
    });
  } else {
    isFetchingToken = true;
    try {
      const response = await token.post(
        'usuario/token',
        {
          refreshToken: getStoredUser()?.token?.refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${getStoredUser()?.token?.accessToken}`,
          },
        },
      );
      cachedToken = await response.data;
    } finally {
      isFetchingToken = false;
    }
  }

  return cachedToken;
}

const requestCache: Record<string, boolean> = {};
const errorCodes = {
  aborted: 20,
  unauthorized: 401,
  unavailable: 500,
};

export const useFetchPublicAPI = createFetch({
  baseUrl: import.meta.env.VITE_BASE_URL_API,
  options: {
    timeout: 20000,
    onFetchError: ctx => {
      const { toast } = useToastStore();
      const { t } = i18n.global;
      if (ctx.response?.url) requestCache[ctx.response?.url] = false;
      if (errorCodes.aborted == ctx.error.code) {
        clearUser();
        router.push('/');
        toast({ message: t('serverError.unavailable') });
        return ctx;
      }
      return ctx;
    },
    beforeFetch: async ({ cancel, url }) => {
      if (requestCache[url]) {
        cancel();
        return;
      }
    },
    afterFetch: ctx => {
      requestCache[ctx.response.url] = false;

      return ctx;
    },
  },
});
////////////////////////////////////// protected routes ////////////////////////
const protectedRouteOptions: UseFetchOptions = {
  timeout: 20000,
  immediate: false,
  onFetchError: ctx => {
    const { toast } = useToastStore();
    if (ctx.response?.url) requestCache[ctx.response?.url] = false;

    if (!ctx.response) {
      for (const item in requestCache) {
        requestCache[item] = false;
      }
    }

    const status = ctx.response?.status;
    const { t } = i18n.global;
    if (errorCodes.aborted == ctx.error.code) {
      clearUser();
      router.push('/');
      toast({ message: t('serverError.unavailable') });
      return ctx;
    }
    if (status == errorCodes.unauthorized) {
      toast({ message: t('serverError.unauthorized') });
      clearUser();
      router.push('/');
      return ctx;
    }

    if ((status as number) > 499 || !ctx.response) {
      toast({ message: t('serverError.unavailable') });
    }

    return ctx;
  },

  beforeFetch: async ({ options, cancel, url }) => {
    if (requestCache[url]) {
      cancel();
      return;
    }

    requestCache[url] = true;

    const storedUser = getStoredUser();

    if (storedUser?.token?.dateToExpire) {
      updateUserToken(new Date(storedUser.token.dateToExpire), storedUser);

      if (storedUser.token.expiresIn < 1) {
        try {
          const data: TokenResponse = await getToken();

          storedUser.token = data;
          storedUser.token.lastFetchedDate = new Date();
          storedUser.token.dateToExpire = addSeconds(
            storedUser.token.lastFetchedDate,
            data.expiresIn,
          );
          setStoredUser(storedUser);
        } catch (e: any) {
          clearUser();
          router.push('/');
        }
      }
    }
    const updatedUser = getStoredUser();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${updatedUser?.token?.accessToken}`,
    };

    return { options };
  },

  afterFetch: ctx => {
    requestCache[ctx.response.url] = false;

    return ctx;
  },
};

export const useFetchAPI = createFetch({
  baseUrl: import.meta.env.VITE_BASE_URL_API,
  options: protectedRouteOptions,
});

export const useFetchServiceAPI = createFetch({
  baseUrl: import.meta.env.VITE_B2B_SERVICES_API,
  options: protectedRouteOptions,
});
