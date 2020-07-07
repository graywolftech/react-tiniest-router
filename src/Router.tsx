import React, { useEffect, useState, useRef } from 'react';
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
    options: {},
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
    router.current = createRouter(
      mapObject(routes, route => {
        return {
          key: route.path,
          value: (params, queryParams) => {
            goTo(route, params, queryParams, window.location.hash.substr(1));
          },
        };
      })
    );

    //initial location
    router.current(window.location.pathname, window.location.search.substr(1));

    //on change route
    window.onpopstate = ev => {
      if (ev.type === 'popstate') {
        router.current(
          window.location.pathname,
          window.location.search.substr(1)
        );
      }
    };
  }, []);

  useEffect(() => {
    const locationUrl =
      window.location.pathname + window.location.search + window.location.hash;
    if (locationUrl !== currentUrl) {
      window.history.pushState(null, null, currentUrl);
    }
  }, [currentUrl]);

  const goTo = (route: RouteType, params = {}, queryParams = {}, hash = '') => {
    const { id, path } = route;
    setState({
      ...state,
      routeId: id,
      path,
      params,
      queryParams,
      hash,
    });
  };

  const isRoute = route => route.id === state.routeId;

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
