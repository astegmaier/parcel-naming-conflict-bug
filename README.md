# parcel-naming-conflict-bug

This repo illustrates a bug ([8331](https://github.com/parcel-bundler/parcel/issues/8331)) in `@parcel/transformer-typescript-types` related to the way it resolves name conflicts in the context of a project that contains wildcard exports (e.g. `export * from './foo'`).

## Repro Steps

1. Clone the repo and run `yarn install`
2. Build the library with `tsc` and `parcel` by running `yarn build`
3. Run the tests in the "consumer" package by running `yarn test`. You can see the bug on lines 17-22 of `consumer/src/index.test.ts`.

## Bug Description

***package.json***
```json
{
    "name": "test-parcel-library",
    "main": "dist/index.js",
    "types": "dist/types.d.ts",
    "scripts": {
        "build": "parcel build src/index.ts"
    }
    ...
}
```
***src/index.ts***
```typescript
export const nameConflict = { messageFromIndex: "this instance of nameConflict is from index.ts" };
export * from "./other"; // Note: this comes _after_ the top-level export above.
```

***src/other.ts***
```typescript
export const nameConflict = { messageFromNameConflict: "this instance of nameConflict is from other.ts" };
```

## Result

When you run the `parcel build`, parcel generates the following `index.d.ts` file:

***types.d.ts***
```typescript
export const nameConflict: {
    messageFromNameConflict: string;
};
declare const _nameConflict1: {
    messageFromIndex: string;
};
```
However, when you consume the library in a different project, the `nameConflict` export at runtime will be the top-level export from `index.ts`:

```typescript
import { nameConflict } from "test-parcel-library";
// @ts-expect-error: the d.ts file generated by parcel is incorrect
console.log(nameConflict.messageFromIndex); // prints "this instance of nameConflict is from index.ts"
```

## Expected Result

The `index.d.ts` file generated by parcel should be:

```typescript
declare const _nameConflict1: {
    messageFromNameConflict: string;
};
export const nameConflict: {
    messageFromIndex: string;
};
```
Interestingly, if you switch the order of the exports in `index.ts`, you'll get this correct output:

***index.ts***
```typescript
export * from "./other"; // Note: this comes _before_ the top-level export below, which fixes the problem.
export const nameConflict = { messageFromIndex: "this instance of nameConflict is from index.ts" };
```

If you build the same project with `tsc` directly, the `.d.ts` files generated will correctly describe the package, regardless of the order of the exports (although  it looks slightly different from what you'd expect from parcel because `tsc` can't bundle the `.d.ts` files for commonjs projects).