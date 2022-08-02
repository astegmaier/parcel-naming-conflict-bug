import * as Parcel from "test-library-parcel";
import * as Tsc from "test-library-tsc";

it("Library built with tsc has types match runtime behavior", () => {
    expect(Tsc.consumer1.messageFromOther1).toBe("foo"); // Type: { messageFromOther1: string; }
    expect(Tsc.consumer2.messageFromOther2).toBe("foo"); // Type: { messageFromOther2: string; }
});

it("Library built with parcel has types that do not match runtime behavior", () => {
    // @ts-expect-error
    expect(Parcel.consumer1.messageFromOther1).toBe("foo") // Type: { messageFromOther2: string; }
    expect(Parcel.consumer2.messageFromOther2).toBe("foo") // Type: any
});
