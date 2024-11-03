import { routes, type RoutePaths } from '../app/config/routes';

export const isMenuItemActive = (path: RoutePaths, pathname: string) => {
  if (path === routes.home) {
    return pathname === '/';
  }
  return pathname.includes(path);
};
