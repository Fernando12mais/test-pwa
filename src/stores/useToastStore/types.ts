export type Toast = {
  message: string;
  timeout?: number;
  id: number;
  color?: 'primary' | 'secondary' | 'error' | 'success';
};
