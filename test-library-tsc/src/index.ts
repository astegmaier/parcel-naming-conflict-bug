// Case 1: the top-level export is _after_ the wildcard export.

export * from "./other1";
export const nameConflict1 = { messageFromIndex: "this instance of nameConflict1 is from index.ts" };

// Case 2: the top-level export is _before_ the wildcard export.

export const nameConflict2 = { messageFromIndex: "this instance of nameConflict2 is from index.ts" };
export * from "./other2";
