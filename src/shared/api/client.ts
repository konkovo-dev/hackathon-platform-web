import createClient from 'openapi-fetch'
import { env } from '../config/env'
import type { paths } from './schema'

export const apiClient = createClient<paths>({
  baseUrl: env.apiBaseUrl,
})
