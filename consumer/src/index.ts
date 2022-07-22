import { nameConflict1, nameConflict2 } from "test-library-parcel";

// Parcel Case 1: (correct) the top-level export is _after_ the wildcard export.
console.log(nameConflict1.messageFromIndex); // "this instance of nameConflict1 is from index.ts"
// @ts-expect-error
console.log(nameConflict1.messageFromNameConflict1); // undefined

// Parcel Case 2: (incorrect): the top-level export is _before_ the wildcard export.
// @ts-expect-error
console.log(nameConflict2.messageFromIndex); /// "this instance of nameConflict2 is from index.ts"
console.log(nameConflict2.messageFromNameConflict2); // undefined

import { tscNameConflict1, tscNameConflict2 } from "test-library-tsc";

// TSC Case 1: (correct) the top-level export is _after_ the wildcard export.
console.log(tscNameConflict1.messageFromIndex); // "this instance of tscNameConflict1 is from index.ts"
// @ts-expect-error
console.log(tscNameConflict1.messageFromNameConflict1); // undefined

// TSC Case 2 (correct): the top-level export is _before_ the wildcard export.
console.log(tscNameConflict2.messageFromIndex); /// "this instance of tscNameConflict2 is from index.ts"
// @ts-expect-error
console.log(tscNameConflict2.messageFromNameConflict2); // undefined

import { MyNamespace } from "test-library-namespaces-tsc";

console.log(MyNamespace.fromStuff1); // "this string is from stuff1.ts, exported as MyNamespace from index.ts"
// @ts-expect-error
console.log(MyNamespace.fromStuff2); // undefined
