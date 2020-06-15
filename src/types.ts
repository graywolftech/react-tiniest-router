type AnyObject = { [x: string]: any };

export type RouteType = {
  id: string;
  path: string;
  extra?: object;
};

export interface RoutesType {
  [propertyName: string]: RouteType;
}

export type RouterStateType = {
  routeId: string;
  path: string;
  params: Record<string, string>;
  queryParams: Record<string, string>;
  extra?: AnyObject;
  options?: AnyObject;
};

export type RouterContextType = RouterStateType & {
  goTo: (route: RouteType, params?: AnyObject, queryParams?: AnyObject) => void;
  isRoute: (route: RouteType) => boolean;
  currentUrl: string;
};
