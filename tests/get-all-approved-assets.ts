import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import { ApprovedAssets } from "./types";

export function runGetAllApprovedAssets(
  CONTRACT_NAME: string,
  approved_assets: ApprovedAssets,
  { deployer }: { deployer: string }
) {
  describe("get-all-approved-assets tests", () => {
    it("should return the list of approved assets", () => {
      // Call get-all-approved-assets
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-all-approved-assets",
        [],
        deployer
      );
      // Verify result is a list of principals
      expect(result.result).toBeOk(
        Cl.list(approved_assets.map((ele) => Cl.principal(ele.asset)))
      );
      const assets = result.result;
      // @ts-ignore
      const assetsList = assets.value.list;
      expect(assetsList.length).toBe(3);

      // Check that the assets match the ones set in the contract initialization
      expect(assetsList).toContainEqual(
        Cl.principal("SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx")
      );
      expect(assetsList).toContainEqual(
        Cl.principal("SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt")
      );
      expect(assetsList).toContainEqual(
        Cl.principal("SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc")
      );
    });
  });
}
