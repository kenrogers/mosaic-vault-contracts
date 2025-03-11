import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

export function runAssetPrices(
  CONTRACT_NAME: string,
  { deployer }: { deployer: string }
) {
  describe("asset-prices tests", () => {
    const btcPrice = 8223296507619;
    const stxPrice = 63490000;
    const stStxPrice = 68068600;
    const usdPrice = 100000000;

    describe("asset price tests", () => {
      it("can get STX price", () => {
        const { result } = simnet.callReadOnlyFn(
          CONTRACT_NAME,
          "get-stx-price",
          [],
          deployer
        );
        expect(result).toBeOk(Cl.uint(stxPrice));
      });

      it("can get BTC price", () => {
        const { result } = simnet.callReadOnlyFn(
          CONTRACT_NAME,
          "get-btc-price",
          [],
          deployer
        );
        expect(result).toBeOk(Cl.uint(btcPrice));
      });

      it("can get stSTX price", () => {
        const { result } = simnet.callReadOnlyFn(
          CONTRACT_NAME,
          "get-ststx-price",
          [],
          deployer
        );
        expect(result).toBeOk(Cl.uint(stStxPrice));
      });

      it("can get USD price", () => {
        const { result } = simnet.callReadOnlyFn(
          CONTRACT_NAME,
          "get-usd-price",
          [],
          deployer
        );
        expect(result).toBeOk(Cl.uint(usdPrice));
      });
    });
  });
}
