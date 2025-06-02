import { NodeEnv } from '~/config/Env'

export const isProd = () => import.meta.env.VITE_NODE_ENV === 'prod'

export const isDev = () => import.meta.env.VITE_NODE_ENV === 'dev'

export function getEnv() {
  if (isProd())
    return NodeEnv.PROD

  return NodeEnv.DEV
}
