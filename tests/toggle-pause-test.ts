import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

export async function runTogglePauseTests(
  CONTRACT_NAME: string,
  {
    deployer,
    address1,
  }: {
    deployer: string;
    address1: string;
  }
) {
  describe("toggle-pause tests", () => {
    it("should allow deployer to toggle pause state", () => {
      // Check initial pause state
      const initialPauseState = simnet.getDataVar(CONTRACT_NAME, "is-paused");
      expect(initialPauseState).toStrictEqual(Cl.bool(false));

      // Toggle pause state (should set to true)
      const toggleResult = simnet.callPublicFn(
        CONTRACT_NAME,
        "toggle-pause",
        [],
        deployer
      );
      expect(toggleResult.result).toBeOk(Cl.bool(true));

      // Verify pause state changed
      const pauseStateAfterToggle = simnet.getDataVar(
        CONTRACT_NAME,
        "is-paused"
      );
      expect(pauseStateAfterToggle).toBeTruthy();

      // Toggle pause state again (should set back to false)
      const toggleAgainResult = simnet.callPublicFn(
        CONTRACT_NAME,
        "toggle-pause",
        [],
        deployer
      );
      expect(toggleAgainResult.result).toBeOk(Cl.bool(true));

      // Verify pause state changed back
      const finalPauseState = simnet.getDataVar(CONTRACT_NAME, "is-paused");
      expect(finalPauseState).toStrictEqual(Cl.bool(false));
    });

    it("should not allow non-deployer to toggle pause state", () => {
      // Try to toggle pause with non-deployer account
      const toggleResult = simnet.callPublicFn(
        CONTRACT_NAME,
        "toggle-pause",
        [],
        address1
      );

      // Should return ERR-NOT-AUTHORIZED (u1000)
      expect(toggleResult.result).toBeErr(Cl.uint(1000));

      // Verify pause state did not change
      const pauseState = simnet.getDataVar(CONTRACT_NAME, "is-paused");
      expect(pauseState).toStrictEqual(Cl.bool(false));
    });
  });
}
