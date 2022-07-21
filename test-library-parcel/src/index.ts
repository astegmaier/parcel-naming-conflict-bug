// Case 1: (correct output) the top-level export is _after_ the wildcard export.

export * from "./name-conflict1";
export const nameConflict1 = { messageFromIndex: "this instance of nameConflict1 is from index.ts" };

// Case 2: (incorrect output) the top-level export is _before_ the wildcard export.

export const nameConflict2 = { messageFromIndex: "this instance of nameConflict2 is from index.ts" };
export * from "./name-conflict2";
