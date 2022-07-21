import { nameConflict1, nameConflict2 } from "test-library-parcel";

// Case 1: (correct) the top-level export is _after_ the wildcard export.

console.log(nameConflict1.messageFromIndex); // "this instance of nameConflict1 is from index.ts"
// @ts-expect-error
console.log(nameConflict1.messageFromNameConflict1); // undefined

// Case 2 (incorrect): the top-level export is _before_ the wildcard export.

//@ts-expect-error
console.log(nameConflict2.messageFromIndex); /// "this instance of nameConflict2 is from index.ts"
console.log(nameConflict2.messageFromNameConflict2); // undefined
