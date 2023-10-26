import { LoginResponse } from '@/services/login/types';
import { SubjectUser } from '@/plugins/casl/ability.types';

export type UserStoreData = Partial<LoginResponse> & {
  role?: SubjectUser;
  token?: LoginResponse['token'] & {
    lastFetchedDate?: Date;
    dateToExpire?: Date;
  };

  sales?: {
    goal: number;
    buyed: number;
  };
};
