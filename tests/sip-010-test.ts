import { principalCV } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

export async function runSip10Tests(
  CONTRACT_NAME: string,
  address: string,
  { tokenName, tokenSymbol }: { tokenName: string; tokenSymbol: string }
) {
  describe("sip-010 token tests", () => {
    it("should have correct token name", () => {
      const { result } = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-name",
        [],
        address
      );
      // @ts-ignore
      expect(result.value).toBeAscii(tokenName);
    });

    it("should have correct token symbol", () => {
      const { result } = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-symbol",
        [],
        address
      );
      // @ts-ignore
      expect(result.value).toBeAscii(tokenSymbol);
    });

    it("should have correct token decimals", () => {
      const { result } = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-decimals",
        [],
        address
      );
      // @ts-ignore
      expect(result.value).toBeUint(8);
    });

    it("should have correct token uri", () => {
      const { result } = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-token-uri",
        [],
        address
      );
      // @ts-ignore
      expect(result.value).toBeNone();
    });

    it("should have correct token supply", () => {
      const { result } = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-total-supply",
        [],
        address
      );
      // @ts-ignore
      expect(result.value).toBeUint(0);
    });

    it("should have correct token balance", () => {
      const { result } = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-balance",
        [principalCV(address)],
        address
      );

      // @ts-ignore
      expect(result.value).toBeUint(0);
    });
  });
}
