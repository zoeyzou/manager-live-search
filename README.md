# Introduction

This is a project that implements an accessible combo box with live searching functionality.

The main tools involved:

- Create React App: to boostrap the project with necessary linting and compilor setup
- Typescript: to ensure the code quality, with strict typecheck and linter on
- Classnames: tiny lib for the ease of toggling classes
- Redux tool kit: an opinionated way of redux, it's more cleaner with duck structure, rationale refer to https://github.com/erikras/ducks-modular-redux
- React testing library and jest: for writing more user oriented test and ensure the accesibility check

Other tools:

- CSS modules: an out-of-the-box way of writing CSS from CRA

# Layout structure

The general principle of the file layout is 'co-location' and 'recursive nesting'.

## Co-location

This means that you always put the files wherever it's relevant. If a component needs a hook, instead of placing it somewhere higher up, it stays with the component. When some other components need the same hook, then we hoist it up to the highest level of the component that requires it. On top of that, tests and css files live right next to the component file.
The other example will be that a page will need its own data fetching and redux setup, place everything within the page folder other than making them global.

## Recursive nesting

Because of the co-location principle, a component might have its own hook, components, types etc. And the components of this component will also have the same structure. We nest and keep the same layout so it is more predictable.

## Project layout

```
├── components/
│ └── FancyComponent/
│ ├── components/
│ │ └── FancyComponentPart/
│ │ ├── FancyComponentPart.tsx
│ │ └── index.ts
│ ├── hooks/
│ │ ├── useFancyComponent.ts
│ │ └── index.ts
│ ├── utils/
│ │ ├── someUtil.ts
│ │ └── index.ts
│ ├── FancyComponent.tsx
│ ├── FancyComponent.module.css
│ ├── FancyComponent.test.tsx
│ └── index.ts
├── pages/
│ └── MyPage/
│ ├── api/
│ │ ├── fetchMyPage.ts
│ │ └── index.ts
│ ├── components/
│ │ ├── MyPagePart/
│ │ │ ├── MyPagePart.tsx
│ │ │ ├── MyPagePart.test.tsx
│ │ │ ├── MyPagePart.module.css
│ │ │ └── index.ts
│ │ └── index.ts
│ ├── redux/
│ │ ├── dataSlice.ts
│ │ ├── viewSlice.ts
│ │ ├── selectors.ts
│ │ └── index.ts
│ ├── hooks/
│ │ ├── useMyPage.ts
│ │ └── index.ts
│ ├── MyPage.tsx
│ ├── MyPage.test.tsx
│ ├── MyPage.module.css
│ └── index.ts
├── store/
│ ├── store.ts
│ └── index.ts
├── types/
│ ├── globalTypes.ts
│ └── index.ts
├── App.tsx
├── index.ts
└── index.css
```

- components: for generic reusable components that could potentially be moved to a component library
- pages: each sub folder should represent a route, mostly standalone except for some global state shared across routes
- store: the global store configuration, every page's reducer should be combined internally and imported here
- types: a few types that should be globally available, such as user etc
- App.tsx: all the context provider should be wrapping here, such as store context, router context, theme context etc
- index.ts: where we mount the SPA
- index.css some global styles, such as normalize css

Note: as you might notice, index.ts is being used everywhere, the idea is that we only expose everything that should be accessible from outside from index file, whatever that is not exported explicitly can signal that it should be done with care.

# Other pattern decisions

## Accessibility

Combo box is a very accessibility-heavy component for web, and it is quite dynamic, so it is not easy to create something that covers both accessibility and ethetic. One of the easist way of doing so is by using datalist tag, as it has everything (keyboard navigation, live search etc) out of box. However, it is almost impossible to style it.

I've done some reading on W3C documents and taken a lot of inspiration from [this](https://www.w3.org/TR/wai-aria-practices-1.2/examples/combobox/combobox-autocomplete-none.html) to make sure that this component is done based on industry standard. It extensively uses aria attributes and covers all the major keyboard navigations, and I made sure to test them fully.

## Tests

The principle is integration over unit testing.

React testing library came in very handy to test on such an interaction-heavy feature -- there are many typing, clicking, key pressing involved. On the other hand, querying by accesibility role also helps a lot on ensuring accessibility.
I simplified the test setup because of time issue. For example, I could have use msw for intercepting the api calls so it's more close to real life situation. Instead of doing that, I used Jest mock to provide data.

## Component reusability

Combo box can be used in different scenario and potentially very different data type. In order to achieve that, I was thinking about using composition pattern. The biggest blocker is that, because each item in the item list needs to access combo box's internal state, we will have to clone the elements within combo box if we just simply use composition. The other option for me is to use render props. The readibility on the consumer level is lower, but it makes the combo box code more clean.

## Location of state

It's always a battle to decide what state to put in Redux and what to put locally as either local state, or create another context provider. With this component, it's no different.

So in terms of combo box, there are a few state:

- expanded/focus: the open state of list box and input chevron
- search value
- list items
- loading state

Currently, combo box takes care of `expanded` and gets the first hand `searchValue` and then debounce it to redux, the rest is purely managed by Redux. It makes sense because then the consumer only cares about the logic that matters - it gets the data, tells combo box that it's loading, then filters by the search value. We get to have the cache benefit, too. The gotcha, so far, is that we cannot do a lazy load outside - in order to lazy load, we need to access the internal state of combo box (expanded). Of course we can always use hook or ref to take control, however it's not very clean. Could be an interesting problem to solve though.
