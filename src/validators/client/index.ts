import z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const schema = z.object({
  brand: z.string().default(''),
  generalSearch: z.string().default(''),
  reference: z.string().default(''),
  application: z.string().default(''),
  position: z.string().default(''),
  side: z.string().default(''),
  extremity: z.string().default(''),
  plate: z
    .string()
    .default('')
    .refine(string => {
      console.log(string);
      return (
        string.length == 0 ||
          /[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/.test(string.toUpperCase()) ||
          /[A-Z]{3}\d{2}[A-Z]\d/.test(string.toUpperCase()) ||
          /[A-Z]{3}\d{4}/.test(string.replace('-', '').toUpperCase()),
        {
          message: 'validation.plate.invalid',
        }
      );
    }),
});
export const productSearchSchema = toTypedSchema(schema);
