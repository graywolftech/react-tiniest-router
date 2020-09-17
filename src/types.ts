export type RouterParams = { [x: string]: string | string[] };
export type RouterQueryParams = { [x: string]: string };

export type RouteType = {
  id: string;
  path: string;
};

export interface RoutesType {
  [propertyName: string]: RouteType;
}

export type RouterStateType = {
  routeId: string;
  path: string;
  params: RouterParams;
  queryParams: RouterQueryParams;
  hash: string;
};

export type RouterContextType = RouterStateType & {
  goTo: (
    route: RouteType,
    params?: RouterParams,
    queryParams?: RouterQueryParams,
    hash?: string
  ) => void;
  isRoute: (route: RouteType) => boolean;
  currentUrl: string;
};
