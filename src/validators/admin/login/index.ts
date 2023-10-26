import z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const schema = z.object({
  email: z
    .string()
    .nonempty(`validation.email.required`)
    .email(`validation.email.invalid`)
    .default(''),
  password: z.string().nonempty(`validation.password.required`).default(''),
});
const loginSchema = toTypedSchema(schema);

export { loginSchema };
