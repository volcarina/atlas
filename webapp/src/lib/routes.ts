const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getAllProgramsRoute = () => '/'

export const viewProgramRouteParams = getRouteParams({programTitle: true})
export type ViewProgramRouteParams = typeof viewProgramRouteParams
export const getViewProgramRoute = ({programTitle}: ViewProgramRouteParams) => `/programs/${programTitle}`

// ✅ ИСПРАВЛЕНО ДЛЯ PROFILE:
export const profileRouteParams = {} as Record<string, never> // Пустой тип
export type ProfileRouteParams = typeof profileRouteParams
export const getProfileRoute = () => '/profile'
