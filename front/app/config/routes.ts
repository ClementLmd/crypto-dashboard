export const routes = {
  addresses: '/addresses',
  home: '/',
  dashboard: '/dashboard',
  fetchHelloWorld: '/fetchHelloWorld',
  reporting: '/reporting',
} as const;

type RoutesType = typeof routes;

type FlattenRoutes<T> = T extends string
  ? T
  : {
      [K in keyof T]: FlattenRoutes<T[K]>;
    }[keyof T];

export type RoutePaths = FlattenRoutes<RoutesType>;
