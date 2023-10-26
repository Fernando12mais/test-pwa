import z from 'zod';

export const finishOrderSchema = z.object({
  paymentForm: z
    .string()
    .nonempty('validation.paymentForm.required')
    .default(''),
  dueDate: z.string().nonempty('validation.dueDate.required').default(''),
  carrier: z.string().nonempty('validation.carrier.required').default(''),
  getOnSite: z.boolean().default(false),
});
