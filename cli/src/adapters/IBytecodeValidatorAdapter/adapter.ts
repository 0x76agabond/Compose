import { validateStorage } from "compose-bytecode-validator";
import type {
  BytecodeValidationInput,
  BytecodeValidationReport,
  IBytecodeValidatorAdapter,
} from "./interface";

export const BytecodeValidatorAdapter: IBytecodeValidatorAdapter = {
  validate(input: BytecodeValidationInput): BytecodeValidationReport {
    return validateStorage(input) as BytecodeValidationReport;
  },
};
