const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>;
};

export const getAllProgramsRoute = () => '/programs';
export const getHomeRoute = () => '/home';
export const getLoginRoute = () => '/';
export const getRegisterRoute = () => '/register';
export const getHistoryRoute = () => '/history';

export const viewProgramRouteParams = getRouteParams({ programTitle: true });
export type ViewProgramRouteParams = typeof viewProgramRouteParams;
export const getViewProgramRoute = ({ programTitle }: ViewProgramRouteParams) => `/programs/${programTitle}`;

export const profileRouteParams = {} as Record<string, never>;
export type ProfileRouteParams = typeof profileRouteParams;
export const getProfileRoute = () => '/profile';
