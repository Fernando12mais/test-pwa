import { LoginResponse } from '../login/types';

export type TokenPayload = {
  refreshToken: string;
};

export type TokenResponse = LoginResponse['token'];
