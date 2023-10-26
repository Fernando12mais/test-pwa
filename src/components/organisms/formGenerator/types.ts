import {
  TextFieldInputProps,
  TextFieldRootProps,
} from '@/components/atoms/textField/types';
import { VNode } from 'vue';

import { VBtn, VCheckbox, VSelect } from 'vuetify/components';

type VBtnProps = Partial<(typeof VBtn)['__defaults']> & {
  class?: string;
};

type VSelectProps = Partial<(typeof VSelect)['__defaults']> & {
  label?: string;
  items: { label: string; value: string }[];
  value?: string;
  loading?: boolean;
  class?: string;
};

type VCheckboxProps = Partial<(typeof VCheckbox)['__defaults']> & {
  label?: string;
  value?: boolean;
  loading?: boolean;
  class?: string;
};
import { ZodEffects, ZodObject, ZodRawShape } from 'zod';

type Cols = string | number | boolean;
type ColsOptions = {
  cols?: Cols;
  md?: Cols;
  sm?: Cols;
  lg?: Cols;
  xl?: Cols;
  xxl?: Cols;
};

export type Fields = {
  input: {
    root?: TextFieldRootProps;
    input?: TextFieldInputProps;
    class?: string;
  };
  select: VSelectProps;
  checkbox: VCheckboxProps;
  custom: {
    component: VNode;
    loading?: boolean;
    class?: string;
  };
};

type Actions<K> = {
  loading?: boolean;
  label: string;

  id: K;
  class?: string;
  type?: 'submit';
  color?:
    | 'primary'
    | 'error'
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'surface';
} & ColsOptions &
  VBtnProps;

type FormGeneratorField<T extends keyof Fields, P> = T extends infer U
  ? {
      type: U;
      props: U extends keyof Fields ? Fields[U] : never;
      id: P;
    } & ColsOptions
  : never;

export type FormGeneratorProps<
  T extends keyof Fields = keyof Fields,
  P extends
    | ZodObject<ZodRawShape>
    | ZodEffects<ZodObject<ZodRawShape>> = ZodObject<ZodRawShape>,
  K extends string = string,
> = {
  fields: FormGeneratorField<T, keyof P['_input']>[];
  actions: Actions<K>[];
  schema: P;
  errorMessage?: string;
};
