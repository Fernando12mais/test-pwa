import z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

export const schema = z.object({
  search: z.string().default('').nullable(),
});
export const searchSchema = toTypedSchema(schema);
