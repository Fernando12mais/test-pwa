import z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const schema = z.object({
  title: z.string().nonempty('validation.title.required').default(''),
});
const settingsSchema = toTypedSchema(schema);

export { settingsSchema };
