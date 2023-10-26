export type TextFieldRootProps = {
  loading: boolean;
};

export type TextFieldInputProps = {
  loading?: boolean;
  labelOnTop?: boolean;
  maxLength?: number;
  errorMessages?: string;
  masks?: ((value: string) => string)[];
  defaultValue?: string;
  label?: string;
};

export type TextFieldInputEmits = {
  onClear: [];
  onKeyDown: [value: string];
  onInput: [value: string];
};

export type TextFieldButtonEmits = { onClick: [] };
