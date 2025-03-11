import { describe, expect, it } from "vitest";
import { runSip10Tests } from "./sip-010-test";
import { runTogglePauseTests } from "./toggle-pause-test";
import { runSetApprovedAssetsAndWeightsTests } from "./set-approved-assets-and-weights ";
import { runGetAllApprovedAssets } from "./get-all-approved-assets";
import { runUpdateBlockHeight } from "./updateBlockHeight";
import { Cl, cvToValue } from "@stacks/transactions";
import { runAssetPrices } from "./asset-prices";
import { runMintSbtcHelper } from "./mint-sbtc-helper";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const address1 = accounts.get("wallet_1")!;

const CONTRACT_NAME = "vault-contract-v2";
const TIMEOUT = 100000000;

const approved_assets = [
  {
    asset: "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx",
    weight: 5000,
    id: 4,
  },
  {
    asset: "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt",
    weight: 3000,
    id: 5,
  },
  {
    asset: "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc",
    weight: 2000,
    id: 6,
  },
];

// describe("Vault Contract Tests", () => {
//   it("ensures simnet is well initialised", () => {
//     expect(simnet.blockHeight).toBeDefined();
//   });

//   // runUpdateBlockHeight();

//   runSip10Tests(CONTRACT_NAME, address1, {
//     tokenName: "ft-name",
//     tokenSymbol: "ft-name",
//   });

//   runTogglePauseTests(CONTRACT_NAME, { address1, deployer });

//   runSetApprovedAssetsAndWeightsTests(CONTRACT_NAME, approved_assets, {
//     deployer,
//     address1,
//   });

//   runGetAllApprovedAssets(CONTRACT_NAME, approved_assets, { deployer });
//   runAssetPrices(CONTRACT_NAME, { deployer });
// });

// import { runMintSbtcHelper } from "./mint-sbtc-helper";

// describe("mint-sbtc demo", () => {
//   it("can mint sbtc to the vault contract", () => {
//     const expectedValue = 8223296507619;
//     const mintAmount = 100000000;
//     runMintSbtcHelper(CONTRACT_NAME, mintAmount, { deployer, address1 });
//     // Get asset info for sBTC
//     const { result: assetInfoResponse } = simnet.callReadOnlyFn(
//       CONTRACT_NAME,
//       "get-asset-info",
//       [Cl.principal("SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc")],
//       deployer
//     );

//     const assetInfo = cvToValue(assetInfoResponse);
//     const responseValue = assetInfo.value;
//     expect(Number(responseValue.balance.value)).toBe(mintAmount);
//     expect(Number(responseValue.weight.value)).toBe(4000);
//     expect(Number(responseValue["value-usd"].value)).toBe(expectedValue);
//   }, 1000000000);
// });

it(
  "can use at-block",
  () => {
    runMintSbtcHelper(CONTRACT_NAME, 1000000, { deployer, address1 });
    const { result: navResult } = simnet.callReadOnlyFn(
      CONTRACT_NAME,
      "get-nav",
      [Cl.list(approved_assets.map((asset) => Cl.principal(asset.asset)))],
      address1
    );
    console.log(cvToValue(navResult));
    simnet.execute("stacks-block-height");
    simnet.execute("burn-block-height");
    const { result: navResultAt } = simnet.callReadOnlyFn(
      CONTRACT_NAME,
      "get-nav-at",
      [
        Cl.uint(741817),
        Cl.list(approved_assets.map((asset) => Cl.principal(asset.asset))),
      ],
      address1
    );
    console.log(cvToValue(navResultAt));
    // const { result: atPriceResult } = simnet.callReadOnlyFn(
    //   CONTRACT_NAME,
    //   "get-nav-at",
    //   [
    //     Cl.uint(741817),
    //     Cl.list([
    //       Cl.principal("SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc"),
    //     ]),
    //   ],
    //   address1
    // );
    // console.log(cvToValue(atPriceResult));
    // const { result: assetInfoResult } = simnet.callReadOnlyFn(
    //   CONTRACT_NAME,
    //   "get-asset-info-at",
    //   [
    //     Cl.principal("SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc"),
    //     Cl.uint(741817),
    //   ],
    //   address1
    // );
    // console.log(cvToValue(assetInfoResult));
  },
  TIMEOUT
);

// const hash =
//   "0x6d9cef16a6082c9ecb0a514f99987753e5ac065ba1cf7d25b4613a1be70fb0eb";

// const code = `(at-block ${hash} (contract-call? .vault-contract-v2 get-btc-price))`;
// const { result } = simnet.execute(code);
// console.log(result);

// const stacks = simnet.execute("stacks-block-height");
// expect(stacks.result).toBeUint(522001);
// const burn = simnet.execute("burn-block-height");
// expect(burn.result).toBeUint(881064);
