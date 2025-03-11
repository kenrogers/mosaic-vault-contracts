import { Cl } from "@stacks/transactions";
import { expect } from "vitest";

export function runMintSbtcHelper(
  CONTRACT_NAME: string,
  mintAmount: number,
  { deployer, address1 }: { deployer: string; address1: string }
) {
  const blockHeight = 1000;

  const hash = simnet.callReadOnlyFn(
    "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-deposit",
    "get-burn-header",
    [Cl.uint(blockHeight)],
    address1
  );
  // @ts-ignore
  const burnHash = hash.result.value.buffer;
  // Mint sBTC to the vault contract address
  const vaultAddress = `${deployer}.${CONTRACT_NAME}`;

  const { result } = simnet.callPublicFn(
    "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-deposit",
    "complete-deposit-wrapper",
    [
      Cl.bufferFromHex(
        "3ae3dfeedc6eb99fb5e2c5d0c90697a66de969c3f4d974ebe2ef104fcea7f13b"
      ),
      Cl.uint(1),
      Cl.uint(mintAmount), // 1 BTC
      Cl.principal(vaultAddress),
      Cl.buffer(burnHash),
      Cl.uint(blockHeight),
      Cl.bufferFromHex(
        "52500d11cabf1049ebb139a82b439d08bd3a8e867a41fb3f368dfa125e043989"
      ),
    ],
    "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4"
  );

  expect(result).toBeOk(Cl.bool(true));

  // Check the balance of the vault contract
  const balanceResponse = simnet.callReadOnlyFn(
    CONTRACT_NAME,
    "get-asset-balance",
    [Cl.principal("SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc")],
    deployer
  );
  // Verify the vault now has the minted sBTC
  expect(balanceResponse.result).toBeOk(Cl.uint(mintAmount));
}
