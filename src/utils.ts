import { Key, pathToRegexp } from 'path-to-regexp';
import queryString from 'query-string';

export const createMatcher = (path: string) => {
  // If a path contains "*" at the end, make the parameter accept an empty string
  path = path.replace(/:([^/]+)\*\//g, (_, match) => `:${match}([^/#?]*)/`);
  var keys: Key[] = [];
  var re = pathToRegexp(path, keys);

  return function(pathname: string) {
    var m = re.exec(pathname);
    if (!m) return false;

    const params: Record<string, string> = {};
    for (const [i, key] of keys.entries()) {
      const param = m[i + 1];
      if (!param) continue;
      let value = decodeURIComponent(param);
      // TODO repeat
      params[key.name] = value;
    }

    return params;
  };
};

//regex
export const paramRegex = /\/(:([^/?]*)\??)/g;

//utils
export const mapObject = <T, V>(
  object: Record<string, T>,
  fn: (value: T, key: string) => { key: string; value: V }
): Record<string, V> => {
  return Object.keys(object).reduce(
    (accum, objKey) => {
      const val = object[objKey];
      const { key, value } = fn(val, objKey);
      accum[key] = value;
      return accum;
    },
    {} as Record<string, V>
  );
};

export const getRegexMatches = (
  string: string,
  regexExpression: RegExp,
  callback: (match: RegExpMatchArray) => void
) => {
  let match;
  while ((match = regexExpression.exec(string)) !== null) {
    callback(match);
  }
};

export const replaceUrlParams = (
  path: string,
  params: Record<string, string>,
  queryParams = {}
) => {
  const queryParamsString = queryString.stringify(queryParams).toString();
  const hasQueryParams = queryParamsString !== '';
  let newPath = path;

  getRegexMatches(path, paramRegex, ([_, paramKey, paramKeyWithoutColon]) => {
    const value = params[paramKeyWithoutColon];
    newPath = value
      ? newPath.replace(paramKey, value)
      : newPath.replace(`/${paramKey}`, '');
  });

  return `${newPath}${hasQueryParams ? `?${queryParamsString}` : ''}`;
};

/**
 * Parse the query params into an object.
 *
 * @param searchString The search string. For example, `foo=bar&bar=foo`.
 */
export function getQueryParams(searchString: string) {
  const params = new URLSearchParams(searchString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    // each 'entry' is a [key, value] tupple
    result[key] = value;
  });
  return result;
}

export type RouterHandler = (path: string, queryString: string) => boolean;

export type GoToHandler = (
  params: Record<string, string>,
  queryParams: Record<string, string>
) => void;

export type Matcher = (path: string) => Record<string, string> | false;

export const createRouter = (routes: {
  [path: string]: GoToHandler;
}): RouterHandler => {
  const matchers = Object.keys(routes).map((path): [Matcher, GoToHandler] => [
    createMatcher(path),
    routes[path],
  ]);

  return (path: string, queryString: string) => {
    return matchers.some(([matcher, fn]) => {
      const params = matcher(path);
      if (params === false) return false;
      const queryParams = getQueryParams(queryString);
      fn(params, queryParams);
      return true;
    });
  };
};
