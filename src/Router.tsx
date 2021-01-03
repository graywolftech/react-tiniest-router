import React, { useEffect, useState, useRef, useCallback } from 'react';
import { replaceUrlParams, createRouter, RouterHandler } from './utils';
import { mapObject } from './utils';
import { RouterContext } from './router-context';
import { RouterStateType, RouteType, RoutesType } from './types';

export const Router: React.FC<{ routes: RoutesType }> = ({
  children,
  routes,
}) => {
  const [state, setState] = useState<RouterStateType>({
    routeId: '',
    path: '/',
    params: {},
    queryParams: {},
    extra: {},
    options: {},
  });

  const router = useRef<RouterHandler | null>(null);

  const currentUrl: string = replaceUrlParams(
    state.path,
    state.params,
    state.queryParams
  );

  useEffect(() => {
    //create a router from the routes object
    router.current = createRouter(
      mapObject(routes, route => {
        return {
          key: route.path,
          value: (params, queryParams) => {
            goTo(route, params, queryParams);
          },
        };
      })
    );

    //initial location
    router.current(window.location.pathname, window.location.search.substr(1));

    //on change route
    window.onpopstate = (ev: PopStateEvent) => {
      if (ev.type === 'popstate') {
        if (router.current)
          router.current(
            window.location.pathname,
            window.location.search.substr(1)
          );
      }
    };
  }, []);

  useEffect(() => {
    if (window.location.pathname !== currentUrl) {
      window.history.pushState(null, '', currentUrl);
    }
  }, [currentUrl]);

  const goTo = useCallback(
    (route: RouteType, params = {}, queryParams = {}, extra = {}) => {
      const { id, path, extra: routeExtra } = route;
      setState({
        ...state,
        routeId: id,
        path,
        params,
        queryParams,
        extra: { ...routeExtra, ...extra },
      });
    },
    []
  );

  const isRoute = useCallback(
    (route: RouteType) => route.id === state.routeId,
    [state.routeId]
  );

  return (
    <RouterContext.Provider
      value={{
        ...state,
        currentUrl,
        goTo,
        isRoute,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
