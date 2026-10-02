/**
 * Centralized API URL helper for Bujju AI
 * Reads VITE_API_URL for production or defaults to relative path for Vite dev proxy
 */
const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function apiUrl(endpoint) {
  if (!endpoint) return BASE_URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${BASE_URL}${cleanEndpoint}`
}
