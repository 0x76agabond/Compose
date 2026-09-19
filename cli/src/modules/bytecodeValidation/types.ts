import type { Address } from "viem";
import type { BytecodeValidationReport } from "../../adapters/IBytecodeValidatorAdapter/interface";

export type FacetBytecodeValidationResult = {
  address: Address;
  report: BytecodeValidationReport | null;
  warning: string | null;
  error: string | null;
};

export type DeploymentBytecodeValidationResult = {
  diamondName: string;
  chainKey: string;
  diamondAddress: Address;
  blockNumber: bigint;
  facets: FacetBytecodeValidationResult[];
};

export type BytecodeValidationSummary = {
  skipped: boolean;
  deployments: DeploymentBytecodeValidationResult[];
  failures: Array<{
    diamondName: string;
    chainKey: string;
    diamondAddress: string;
    message: string;
  }>;
};
