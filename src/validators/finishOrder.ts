import z from 'zod';

export const finishOrderSchema = z.object({
  paymentForm: z
    .string()
    .nonempty('validation.paymentForm.required')
    .default(''),
  dueDate: z.string().nonempty('validation.dueDate.required').default(''),
  carrier: z.string().default(''),
  getOnSite: z.boolean().default(false),
  nfe: z.null().default(null),
});
