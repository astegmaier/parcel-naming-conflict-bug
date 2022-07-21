// Case 1: the top-level export is _after_ the wildcard export.

export * from "./name-conflict1";
export const tscNameConflict1 = { messageFromIndex: "this instance of tscNameConflict1 is from index.ts" };

// Case 2: the top-level export is _before_ the wildcard export.

export const tscNameConflict2 = { messageFromIndex: "this instance of tscNameConflict2 is from index.ts" };
export * from "./name-conflict2";
