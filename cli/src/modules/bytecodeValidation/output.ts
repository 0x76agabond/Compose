import type { ComposeContext, ModuleState } from "../../context/types";
import { red, yellow } from "../../utils/terminal";
import type { BytecodeValidationSummary } from "./types";

/** Prints deployed-bytecode collisions and scoped warnings. */
export function showBytecodeValidationReport(ctx: ComposeContext): void {
  const state = ctx.state.bytecodeValidation as ModuleState<BytecodeValidationSummary> | undefined;
  if (!state || state.result?.skipped) return;

  if (!state.success && !state.result) {
    console.error(red("\nBytecode validation failed"));
    console.error(red(state.error?.message ?? "Bytecode validation failed."));
    return;
  }

  for (const failure of state.result?.failures ?? []) {
    console.error(red("\nBytecode validation failed"));
    console.error(`${failure.diamondName} / ${failure.chainKey}`);
    console.error(`  ${failure.diamondAddress}`);
    console.error(`  ${failure.message}`);
  }

  for (const deployment of state.result?.deployments ?? []) {
    const scope = `${deployment.diamondName} / ${deployment.chainKey}`;
    for (const facet of deployment.facets) {
      if (facet.error) {
        console.error(red("\nBytecode validation failed"));
        console.error(`${scope} / ${facet.address}`);
        console.error(`  ${facet.error}`);
        continue;
      }
      if (facet.warning) {
        console.warn(yellow(`\nBytecode validation warning`));
        console.warn(`${scope} / ${facet.address}`);
        console.warn(`  ${facet.warning}`);
        continue;
      }
      if (!facet.report) continue;

      for (const collision of facet.report.collisions) {
        console.error(red("\nBytecode validation failed"));
        console.error(`${scope} / ${facet.address}`);
        console.error(`  ${collision.virtualPath}`);
        console.error(`  Expected: ${collision.expectedType}`);
        console.error(`  Observed: ${collision.observedType}`);
        console.error(`  Selector: ${collision.location.selector}`);
        if (collision.location.pc !== undefined) console.error(`  PC: ${collision.location.pc}`);
        console.error(`  ${collision.reason}`);
      }

      for (const uncertain of facet.report.uncertainScopes) {
        console.warn(yellow("\nBytecode validation warning"));
        console.warn(`${scope} / ${facet.address}`);
        console.warn(yellow(`  ${uncertain.virtualPath ?? uncertain.location.symbolicPath}`));
        console.warn(yellow(`  ${uncertain.reason}`));
      }
      for (const diagnostic of facet.report.diagnostics) {
        console.warn(yellow("\nBytecode validation warning"));
        console.warn(`${scope} / ${facet.address}`);
        console.warn(yellow(`  ${diagnostic.symbolicPath}`));
        console.warn(yellow(`  ${diagnostic.message}`));
      }
      for (const warning of facet.report.delegatecallWarnings) {
        console.warn(yellow("\nBytecode validation warning"));
        console.warn(`${scope} / ${facet.address}`);
        console.warn(yellow(`  delegatecall at PC ${warning.pc}: ${warning.reason}`));
      }
    }
  }
}
