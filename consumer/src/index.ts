import { nameConflict } from "test-library-parcel";

// This is correct:
// Type: { messageFromIndex: string }
// Runtime value: { messageFromIndex: 'this instance of nameConflict is from index.ts' }
console.log(nameConflict); 