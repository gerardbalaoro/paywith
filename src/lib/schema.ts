import { z } from 'zod'

export const Category = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
})

export type Category = z.infer<typeof Category>

export const Reward = z
  .object({
    id: z.string().min(1),
    type: z.enum(['cashback', 'points']),
    value: z.number().nonnegative(),
    isFixed: z.boolean().default(false),
    minSpend: z.number().nonnegative().default(0),
    categories: z.array(z.string().min(1)),
    earnRate: z.number().positive().optional(),
    redemptionRate: z.number().positive().optional(),
  })
  .superRefine((rule, ctx) => {
    if (rule.type === 'points') {
      if (!rule.earnRate) {
        ctx.addIssue({
          code: 'custom',
          message: 'earnRate is required for points',
          path: ['earnRate'],
        })
      }
      if (!rule.redemptionRate) {
        ctx.addIssue({
          code: 'custom',
          message: 'redemptionRate is required for points',
          path: ['redemptionRate'],
        })
      }
    }
  })

export type Reward = z.infer<typeof Reward>

export const PaymentMethod = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  rewards: z.array(Reward),
})

export type PaymentMethod = z.infer<typeof PaymentMethod>
