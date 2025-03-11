import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import { ApprovedAssets } from "./types";

export function runSetApprovedAssetsAndWeightsTests(
  CONTRACT_NAME: string,
  approved_assets: ApprovedAssets,
  {
    deployer,
    address1,
  }: {
    deployer: string;
    address1: string;
  }
) {
  describe("set-approved-assets-and-weights tests", () => {
    it("should allow deployer to set approved assets and weights", () => {
      // Get initial approved nonce
      const initialNonce = simnet.getDataVar(CONTRACT_NAME, "approved-nonce");
      expect(initialNonce).toStrictEqual(Cl.uint(3)); // Initial value from contract initialization

      // Call set-approved-assets-and-weights
      const result = simnet.callPrivateFn(
        CONTRACT_NAME,
        "set-approved-assets-and-weights",
        [
          Cl.list([
            Cl.tuple({
              asset: Cl.principal(approved_assets[0].asset),
              weight: Cl.uint(approved_assets[0].weight),
            }),
            Cl.tuple({
              asset: Cl.principal(approved_assets[1].asset),
              weight: Cl.uint(approved_assets[1].weight),
            }),
            Cl.tuple({
              asset: Cl.principal(approved_assets[2].asset),
              weight: Cl.uint(approved_assets[2].weight),
            }),
          ]),
        ],
        deployer
      );

      // Verify result
      expect(result.result).toBeOk(Cl.bool(true));

      // Verify nonce was incremented by 3 (one for each asset)
      const newNonce = simnet.getDataVar(CONTRACT_NAME, "approved-nonce");
      expect(newNonce).toStrictEqual(Cl.uint(6)); // 3 + 3 = 6

      // Verify assets were approved and weights were set correctly
      for (const asset of approved_assets) {
        const approvedId = simnet.getMapEntry(
          CONTRACT_NAME,
          "approved-assets",
          Cl.principal(asset.asset)
        );
        expect(approvedId).toBeSome(Cl.uint(asset.id));
        const weight = simnet.getMapEntry(
          CONTRACT_NAME,
          "asset-weights",
          Cl.principal(asset.asset)
        );
        expect(weight).toBeSome(Cl.uint(asset.weight));
        const assetById = simnet.getMapEntry(
          CONTRACT_NAME,
          "approved-assets-id",
          Cl.uint(asset.id)
        );
        expect(assetById).toBeSome(Cl.principal(asset.asset));
      }
    });

    it("should not allow non-deployer to set approved assets and weights", () => {
      // Get initial approved nonce
      const initialNonce = simnet.getDataVar(CONTRACT_NAME, "approved-nonce");

      // Try to call set-approved-assets-and-weights with non-deployer account
      const result = simnet.callPrivateFn(
        CONTRACT_NAME,
        "set-approved-assets-and-weights",
        [
          Cl.list([
            Cl.tuple({
              asset: Cl.principal(
                "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wbtc"
              ),
              weight: Cl.uint(5000),
            }),
            Cl.tuple({
              asset: Cl.principal(
                "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdc"
              ),
              weight: Cl.uint(3000),
            }),
            Cl.tuple({
              asset: Cl.principal(
                "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-weth"
              ),
              weight: Cl.uint(2000),
            }),
          ]),
        ],
        address1
      );

      // Should return ERR-NOT-AUTHORIZED (u1000)
      expect(result.result).toBeErr(Cl.uint(1000));

      // Verify nonce did not change
      const newNonce = simnet.getDataVar(CONTRACT_NAME, "approved-nonce");
      expect(newNonce).toStrictEqual(initialNonce);
    });

    it("should reject invalid weights (> 10000)", () => {
      // Get initial approved nonce
      const initialNonce = simnet.getDataVar(CONTRACT_NAME, "approved-nonce");

      // Try to set a weight > 10000
      const result = simnet.callPrivateFn(
        CONTRACT_NAME,
        "set-approved-assets-and-weights",
        [
          Cl.list([
            Cl.tuple({
              asset: Cl.principal(
                "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wbtc"
              ),
              weight: Cl.uint(11000), // Invalid weight
            }),
            Cl.tuple({
              asset: Cl.principal(
                "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdc"
              ),
              weight: Cl.uint(3000),
            }),
            Cl.tuple({
              asset: Cl.principal(
                "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-weth"
              ),
              weight: Cl.uint(2000),
            }),
          ]),
        ],
        deployer
      );

      // Should return ERR-INVALID-WEIGHT (u1001)
      expect(result.result).toBeErr(Cl.uint(1001));

      // Verify nonce did not change
      const newNonce = simnet.getDataVar(CONTRACT_NAME, "approved-nonce");
      expect(newNonce).toStrictEqual(initialNonce);
    });
  });
}
