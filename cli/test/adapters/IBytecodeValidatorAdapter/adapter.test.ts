import { describe, expect, it } from "vitest";
import { BytecodeValidatorAdapter } from "../../../src/adapters/IBytecodeValidatorAdapter/adapter";

describe("BytecodeValidatorAdapter", () => {
  it("runs the packaged WASM validator through the CLI boundary", () => {
    const report = BytecodeValidatorAdapter.validate({
      bytecode: "0x6000600055",
      virtualStorageLayout: { records: [] },
    });

    expect(report).toEqual({
      collisions: expect.any(Array),
      validatedVariables: expect.any(Array),
      uncertainScopes: expect.any(Array),
      diagnostics: expect.any(Array),
      delegatecallWarnings: expect.any(Array),
    });
  });
});
