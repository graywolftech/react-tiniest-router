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
    hash: '',
  });

  const router = useRef<RouterHandler | null>(null);

  const currentUrl: string = replaceUrlParams(
    state.path,
    state.params,
    state.queryParams,
    state.hash
  );

  useEffect(() => {
    //create a router from the routes object
    const local = (router.current = createRouter(
      mapObject(routes, route => {
        return {
          key: route.path,
          value: (params, queryParams) => {
            goTo(route, params, queryParams, window.location.hash.substr(1));
          },
        };
      })
    ));

    //initial location
    router.current(window.location.pathname, window.location.search.substr(1));

    //on change route
    window.onpopstate = (ev: PopStateEvent) => {
      if (ev.type === 'popstate') {
        local(window.location.pathname, window.location.search.substr(1));
      }
    };
  }, []);

  useEffect(() => {
    const locationUrl =
      window.location.pathname + window.location.search + window.location.hash;
    if (locationUrl !== currentUrl) {
      window.history.pushState(null, '', currentUrl);
    }
  }, [currentUrl]);

  const goTo = useCallback(
    (route: RouteType, params = {}, queryParams = {}, hash = '') => {
      const { id, path } = route;
      setState({
        ...state,
        routeId: id,
        path,
        params,
        queryParams,
        hash,
      });
    },
    [state]
  );

  const isRoute = (route: RouteType) => route.id === state.routeId;

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
