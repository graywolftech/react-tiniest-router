type AnyObject = { [x: string]: any };

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
  params: Record<string, string>;
  queryParams: Record<string, string>;
  hash: string;
  options?: AnyObject;
};

export type RouterContextType = RouterStateType & {
  goTo: (
    route: RouteType,
    params?: AnyObject,
    queryParams?: AnyObject,
    hash?: string
  ) => void;
  isRoute: (route: RouteType) => boolean;
  currentUrl: string;
};
