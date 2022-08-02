# Namespace Imports Bug

This repo illustrates a bug ([8360](https://github.com/parcel-bundler/parcel/issues/8360)) in `@parcel/transformer-typescript-types` related to the way it resolves name conflicts in the context of a project that contains namespace imports (e.g. `import * MyNamespace from './foo'`).

## Repro Steps

1. Clone the repo and run `yarn install`
2. Build the library with `tsc` and `parcel` by running `yarn build`
3. Run the tests in the "consumer" package by running `yarn test`. You can see the bug on lines 9-14 of `consumer/src/index.test.ts`.

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
import * as NamespaceImport from "./other1";
export const consumer1: typeof NamespaceImport.nameConflict = { messageFromOther1: "foo" }
export const consumer2: typeof NamespaceImport.notAConflict = { messageFromOther2: "foo" }
```

***src/other2.ts***
```typescript
export { nameConflict as notAConflict } from "./other2";
export const nameConflict = { messageFromOther1: "foo" };
```

***src/other2.ts***
```typescript
export const nameConflict = { messageFromOther2: "foo" };
```

## Result

When you build this project with parcel, and try to consume it, the types don't describe the runtime behavior. If you build the same library with tsc, you get correct types.

```ts
import * as Parcel from "test-library-parcel";
import * as Tsc from "test-library-tsc"; // This library has the same source code, but it's built with tsc.

it("Library built with tsc has types match runtime behavior", () => {
    expect(Tsc.consumer1.messageFromOther1).toBe("foo"); // Type: { messageFromOther1: string; }
    expect(Tsc.consumer2.messageFromOther2).toBe("foo"); // Type: { messageFromOther2: string; }
});

it("Library built with parcel has types that do not match runtime behavior", () => {
    // @ts-expect-error
    expect(Parcel.consumer1.messageFromOther1).toBe("foo") // Type: { messageFromOther2: string; }
    expect(Parcel.consumer2.messageFromOther2).toBe("foo") // Type: any
});
```

Here is the `index.d.ts` file that parcel currently generates:

***types.d.ts***
```ts
declare const nameConflict: {
    messageFromOther2: string;
};
export const consumer1: typeof nameConflict;
export const consumer2: typeof NamespaceImport.notAConflict;
```
## Expected Result

The types should correctly describe the runtime behavior. This would be `index.d.ts` I would expect, were this to be fixed:

```typescript
declare const nameConflict: {
    messageFromOther1: string;
};
declare const _nameConflict1 {
    messageFromOther2: string;
};
export const consumer1: typeof nameConflict;
export const consumer2: typeof _nameConflict1;
```
