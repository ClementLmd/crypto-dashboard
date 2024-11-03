export const routes = {
  home: '/',
  database: {
    index: '/database',
    get: '/database/get',
    post: '/database/post',
  },
  fetchHelloWorld: '/fetchHelloWorld',
} as const;

type RoutesType = typeof routes;

type FlattenRoutes<T> = T extends string
  ? T
  : {
      [K in keyof T]: FlattenRoutes<T[K]>;
    }[keyof T];

export type RoutePaths = FlattenRoutes<RoutesType>;
