import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const Env = createEnv({
  server: {
    KEY_COOKIE_ACCESS_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().optional(),
  },
  shared: {
    NODE_ENV: z
      .enum(['test', 'development', 'staging', 'production'])
      .optional(),
  },
  runtimeEnv: {
    KEY_COOKIE_ACCESS_TOKEN: process.env.KEY_COOKIE_ACCESS_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
})
