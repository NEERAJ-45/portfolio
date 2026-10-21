export function cssVar(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function hex(name: string): string {
  return cssVar(`--${name}`)
}

export const COLORS = {
  lime: '#c5ff7c',
  amber: '#ffb454',
  rose: '#ff6f91',
  indigo: '#6366f1',
  text: '#f3f4f6',
  bg: '#030408',
  bgAlt: '#080a10',
  panelBg: '#141a28',
  panelBorder: '#3a3244',
} as const
