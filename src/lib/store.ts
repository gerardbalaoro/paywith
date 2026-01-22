import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'

import { Category, PaymentMethod, Reward } from '@/lib/schema'
import { CategoriesData, PaymentMethodsData } from '@/lib/data'

const CategoriesStorageKey = 'paywith-categories'
const MethodsStorageKey = 'paywith-methods'

const createStorage = <T>() =>
  createJSONStorage<T>(() =>
    typeof window !== 'undefined'
      ? window.localStorage
      : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        },
  )

// =============================================================================
// Categories
// =============================================================================

export const Categories = {
  atom: atomWithStorage<Category[]>(
    CategoriesStorageKey,
    [],
    createStorage<Category[]>(),
    { getOnInit: false },
  ),

  add: (categories: Category[], label: string): Category[] => {
    const trimmed = label.trim()
    const id = uuid()
    const parsed = Category.safeParse({ id, label: trimmed })
    if (!parsed.success) {
      return categories
    }
    return [...categories, { id, label: trimmed }]
  },

  update: (categories: Category[], id: string, label: string): Category[] => {
    const trimmed = label.trim()
    if (!trimmed) {
      return categories
    }
    return categories.map((cat) =>
      cat.id === id ? { ...cat, label: trimmed } : cat,
    )
  },

  remove: (
    categories: Category[],
    methods: PaymentMethod[],
    categoryId: string,
  ): { categories: Category[]; methods: PaymentMethod[] } => {
    const newCategories = categories.filter((cat) => cat.id !== categoryId)

    const newMethods = methods.map((method) => ({
      ...method,
      rewards: method.rewards.map((reward) => ({
        ...reward,
        categories: reward.categories.filter((c) => c !== categoryId),
      })),
    }))

    return { categories: newCategories, methods: newMethods }
  },
}

// =============================================================================
// Payment Methods
// =============================================================================

export const PaymentMethods = {
  atom: atomWithStorage<PaymentMethod[]>(
    MethodsStorageKey,
    [],
    createStorage<PaymentMethod[]>(),
    { getOnInit: false },
  ),

  add: (methods: PaymentMethod[], name: string): PaymentMethod[] => {
    const trimmed = name.trim()
    if (!trimmed) {
      return methods
    }
    const id = uuid()
    const parsed = PaymentMethod.safeParse({ id, name: trimmed, rewards: [] })
    if (!parsed.success) {
      return methods
    }
    return [...methods, { id, name: trimmed, rewards: [] }]
  },

  update: (
    methods: PaymentMethod[],
    id: string,
    name: string,
  ): PaymentMethod[] => {
    const trimmed = name.trim()
    if (!trimmed) {
      return methods
    }
    return methods.map((m) => (m.id === id ? { ...m, name: trimmed } : m))
  },

  remove: (methods: PaymentMethod[], id: string): PaymentMethod[] => {
    return methods.filter((m) => m.id !== id)
  },
}

// =============================================================================
// Client-only initialization
// =============================================================================

const parseStored = <T>(
  value: string | null,
  schema: z.ZodType<T>,
): T | null => {
  if (!value) {
    return null
  }
  try {
    const parsedJson: unknown = JSON.parse(value)
    const parsed = schema.safeParse(parsedJson)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export const getInitialData = (): {
  categories: Category[]
  methods: PaymentMethod[]
} => {
  if (typeof window === 'undefined') {
    return { categories: [], methods: [] }
  }

  const storedCategories = parseStored(
    window.localStorage.getItem(CategoriesStorageKey),
    z.array(Category),
  )
  const storedMethods = parseStored(
    window.localStorage.getItem(MethodsStorageKey),
    z.array(PaymentMethod),
  )

  return {
    categories: storedCategories ?? CategoriesData,
    methods: storedMethods ?? PaymentMethodsData,
  }
}

// =============================================================================
// Rewards
// =============================================================================

export const Rewards = {
  add: (
    methods: PaymentMethod[],
    methodId: string,
    reward: Reward,
  ): PaymentMethod[] => {
    const parsed = Reward.safeParse(reward)
    if (!parsed.success) {
      return methods
    }
    return methods.map((m) =>
      m.id === methodId ? { ...m, rewards: [...m.rewards, parsed.data] } : m,
    )
  },

  update: (
    methods: PaymentMethod[],
    methodId: string,
    reward: Reward,
  ): PaymentMethod[] => {
    const parsed = Reward.safeParse(reward)
    if (!parsed.success) {
      return methods
    }
    return methods.map((m) =>
      m.id === methodId
        ? {
            ...m,
            rewards: m.rewards.map((r) =>
              r.id === reward.id ? parsed.data : r,
            ),
          }
        : m,
    )
  },

  remove: (
    methods: PaymentMethod[],
    methodId: string,
    rewardId: string,
  ): PaymentMethod[] => {
    return methods.map((m) =>
      m.id === methodId
        ? { ...m, rewards: m.rewards.filter((r) => r.id !== rewardId) }
        : m,
    )
  },
}
