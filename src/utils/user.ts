import { UserStoreData } from '@/stores/useUserStore/types';
import { differenceInSeconds } from 'date-fns';

export function getStoredUser() {
  const storedUser = localStorage.getItem('userData');

  if (storedUser) {
    return JSON.parse(storedUser) as UserStoreData;
  }

  return null;
}

export function setStoredUser(user: UserStoreData) {
  localStorage.setItem('userData', JSON.stringify(user));
}

export function updateUserToken(dateToExpire: Date, user: UserStoreData) {
  const lastFetchedDate = new Date();
  const expiresIn = differenceInSeconds(dateToExpire, lastFetchedDate);

  if (user.token) {
    user.token.lastFetchedDate = lastFetchedDate;
    user.token.expiresIn = expiresIn;
  }
  setStoredUser(user);

  return getStoredUser();
}

export function clearUser() {
  localStorage.removeItem('userData');
  localStorage.removeItem('userAbilities');
  localStorage.removeItem('filters');
  localStorage.removeItem('config');
}
export function removeStoredUser() {
  localStorage.removeItem('userData');
}
