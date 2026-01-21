import { z } from 'zod'

import { Category, PaymentMethod } from '@/lib/schema'

/** Settings data schema (version 1) */
export const Settings = z.object({
  version: z.literal(1),
  categories: z.array(Category),
  methods: z.array(PaymentMethod),
})

export type Settings = z.infer<typeof Settings>

/**
 * Create settings export data from current state
 */
export const exportSettings = (
  categories: Category[],
  methods: PaymentMethod[],
): Settings => ({
  version: 1,
  categories,
  methods,
})

/**
 * Parse and validate settings data. Returns the validated settings or throws an error.
 */
export const importSettings = (data: unknown): Settings => {
  return Settings.parse(data)
}
