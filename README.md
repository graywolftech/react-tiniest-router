## 🐁 react-tiniest-router

For the times when you *really* need a simple router.  
Based on [mobx-router](https://github.com/kitze/mobx-router) and [rttr](https://github.com/kitze/rttr).


## Usage

1. Write the routes object. 

```js
const routes = {
  home: {
    id: 'home',
    path: '/',
  },
  about: {
    id: 'about',
    path: '/about',
  },
  gallery: {
    id: 'gallery',
    path: '/gallery/:imageId',
  },
}
```

2. Wrap your app with the Router component
```js
<Router routes={routes}>
    <App />
</Router>
```


3. Use the router using `useRouter`

- Use the `goTo` function for navigating to a route
- Use the `isRoute` function for checking if a route is currently active


```js
const Root = () => {
  const {goTo, isRoute} = useRouter();

  return (
    <div>
      <div>
        <button onClick={() => goTo(routes.home)}>go home</button>
        <button onClick={() => goTo(routes.about)}>go to about</button>
        <button onClick={() => goTo(routes.gallery, { imageId: 1 })}>
          go to picture 1
        </button>
        <button onClick={() => goTo(routes.gallery, { imageId: 2 })}>
          go to picture 2
        </button>
        <button onClick={() => goTo(routes.gallery, { imageId: 3 })}>
          go to picture 3
        </button>
      </div>

      <br/>

      {isRoute(routes.home) && <div>Welcome home</div>}
      {isRoute(routes.about) && <div>About us</div>}
      {isRoute(routes.gallery) && <Gallery />}
    </div>
  );
};
```

4. You also get `params`, `queryParams`, `routeId`, `path` in the router object.

```js
const Gallery = () => {
  const { params } = useRouter();
  return <div>Browsing picture {params.imageId}</div>;
};
```

5. Use modifiers to create special parameters.
```js
const routes = {
  zeroOrMore: {
    id: 'zeroOrMore',
    // Matches "/", "/hi" and "/hi/ciao"
    path: '/:foo*',
  },
  oneOrMore: {
    id: 'oneOrMore',
    // Matches "/hola" and "/hola/hallo" but not "/"
    path: '/:bar+',
  },
  optional: {
    id: 'optional',
    // Matches "/" or "/bonjour"
    path: '/:bar?',
  },
  emptyString: {
    id: 'emptyString',
    // qux matches an empty string meaning "/hi/hello" and "//hello" would both match
    // This is a special modifier that is implemented in this library and not in `path-to-regexp`
    path: /:qux@/:quuz
}
```

> See [path-to-regexp](https://github.com/pillarjs/path-to-regexp) for more details.

--- 

## FAQ

- Does it support optional parameters in the path definition?  
Not yet, but it will as soon as I need them in a project.

- Does it support SSR?  
No.

- Will it ever support SSR?  
NO.

- Does it have tests?  
TypeScript is poor man's tests.

- Will it ever have tests?  
If you write them.

- Does it support code splitting?  
Did you see which repo you're actually browsing?  
Does it say "facebook" in the url? No. So, no.

- Does it support async routes?  
Please stop doing stupid stuff with your router.

- Does it support protected routes?  
Please stop doing stupid stuff with your router.

- I'm offended by this FAQ section, where can I complain?  
Yell @ me on [Twitter](https://twitter.com/thekitze)

### 🙋‍♂️ Made by [@thekitze](https://twitter.com/thekitze)  
- 🏫 [React Academy](https://reactacademy.io) - Interactive React and GraphQL workshops
- 💌 [Twizzy](https://twizzy.app) - A standalone app for Twitter DM
- 🤖 [JSUI](https://github.com/kitze/JSUI) - A powerful UI toolkit for managing JavaScript apps
- 📹 [Vlog](https://youtube.com/kitze) - Watch my sad developer life
