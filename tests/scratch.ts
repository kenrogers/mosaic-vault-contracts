// describe("get-asset-info tests", () => {
//   it(
//     "should return correct asset info for wststx",
//     () => {
//       const { result } = simnet.callReadOnlyFn(
//         CONTRACT_NAME,
//         "get-asset-info",
//         [
//           Cl.contractPrincipal(
//             "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//             "token-wststx"
//           ),
//         ],
//         deployer
//       );
//       expect(result).toBeOk(
//         Cl.tuple({
//           asset: Cl.principal(
//             "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx"
//           ),
//           weight: Cl.uint(3000),
//           balance: Cl.uint(0),
//           "value-usd": Cl.uint(0),
//         })
//       );
//     },
//     TIMEOUT
//   );

//   it(
//     "should return correct asset info for susdt",
//     () => {
//       const { result } = simnet.callReadOnlyFn(
//         CONTRACT_NAME,
//         "get-asset-info",
//         [
//           Cl.contractPrincipal(
//             "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK",
//             "token-susdt"
//           ),
//         ],
//         deployer
//       );
//       expect(result).toBeOk(
//         Cl.tuple({
//           asset: Cl.principal(
//             "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt"
//           ),
//           weight: Cl.uint(3000),
//           balance: Cl.uint(0),
//           "value-usd": Cl.uint(0),
//         })
//       );
//     },
//     TIMEOUT
//   );

//   it(
//     "should return correct asset info for wsbtc",
//     async () => {
// const mintAmount = 100000000;
// const { result: priceResult } = simnet.callReadOnlyFn(
//   CONTRACT_NAME,
//   "get-btc-price",
//   [],
//   deployer
// );

// runMintSbtcHelper(CONTRACT_NAME, mintAmount, { deployer, address1 });

//       const { result: infoResult } = simnet.callReadOnlyFn(
//         CONTRACT_NAME,
//         "get-asset-info",
//         [
//           Cl.contractPrincipal(
//             "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//             "token-wsbtc"
//           ),
//         ],
//         deployer
//       );

//       const expectedValueUSD =
//         // @ts-ignore
//         (Number(priceResult.value.value) * Number(mintAmount)) / 1e8;
//       // @ts-ignore
//       expect(Number(infoResult.value.data["value-usd"].value)).toBe(
//         expectedValueUSD
//       );
//     },
//     TIMEOUT
//   );

//   it(
//     "should fail for non-approved asset",
//     () => {
//       const { result } = simnet.callReadOnlyFn(
//         CONTRACT_NAME,
//         "get-asset-info",
//         [
//           Cl.principal(
//             "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.trait-sip-010"
//           ),
//         ],
//         deployer
//       );
//       expect(result).toBeErr(Cl.uint(1002));
//     },
//     TIMEOUT
//   );
// });

// describe("get-nav tests", () => {
//   // it(
//   //   "should calculate the correct NAV when all assets have zero balance",
//   //   () => {
//   //     // Call get-nav with all approved assets
//   //     const { result } = simnet.callReadOnlyFn(
//   //       CONTRACT_NAME,
//   //       "get-nav",
//   //       [
//   //         Cl.list([
//   //           Cl.contractPrincipal(
//   //             "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//   //             "token-wststx"
//   //           ),
//   //           Cl.contractPrincipal(
//   //             "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK",
//   //             "token-susdt"
//   //           ),
//   //           Cl.contractPrincipal(
//   //             "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//   //             "token-wsbtc"
//   //           ),
//   //         ]),
//   //       ],
//   //       deployer
//   //     );

//   //     // Initially, all assets should have zero balance, so NAV should be 0
//   //     expect(result).toBeOk(Cl.uint(0));
//   //   },
//   //   TIMEOUT
//   // );

//   it(
//     "should calculate the correct NAV when sbtc minted to the contract",
//     () => {
//       // Call get-nav with all approved assets
//       const mintAmount = 100000000;

//       runMintSbtcHelper(CONTRACT_NAME, mintAmount, { deployer, address1 });

//       const { result } = simnet.callReadOnlyFn(
//         CONTRACT_NAME,
//         "get-nav",
//         [
//           Cl.list([
//             Cl.contractPrincipal(
//               "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//               "token-wststx"
//             ),
//             Cl.contractPrincipal(
//               "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK",
//               "token-susdt"
//             ),
//             Cl.contractPrincipal(
//               "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//               "token-wsbtc"
//             ),
//           ]),
//         ],
//         deployer
//       );
//       // @ts-ignore
//       expect(result.value.value).toBeGreaterThan(0);
//     },
//     TIMEOUT
//   );

//   it(
//     "should calculate the correct NAV when sbtc minted to the contract",
//     () => {
//       // Call get-nav with all approved assets
//       const mintAmount = 100000000;

//       runMintSbtcHelper(CONTRACT_NAME, mintAmount, { deployer, address1 });

//       // const { result: prevResult } = simnet.callReadOnlyFn(
//       //   CONTRACT_NAME,
//       //   "get-nav-at-block",
//       //   [
//       //     Cl.uint(741800),
//       //     Cl.list([
//       //       Cl.contractPrincipal(
//       //         "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//       //         "token-wststx"
//       //       ),
//       //       Cl.contractPrincipal(
//       //         "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK",
//       //         "token-susdt"
//       //       ),
//       //       Cl.contractPrincipal(
//       //         "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//       //         "token-wsbtc"
//       //       ),
//       //     ]),
//       //   ],
//       //   deployer
//       // );

//       // console.log(simnet.stacksBlockHeight);
//       // // console.log(simnet.)
//       // const { result: currentResult } = simnet.callReadOnlyFn(
//       //   CONTRACT_NAME,
//       //   "get-nav-at-block",
//       //   [
//       //     Cl.uint(simnet.stacksBlockHeight),
//       //     Cl.list([
//       //       Cl.contractPrincipal(
//       //         "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//       //         "token-wststx"
//       //       ),
//       //       Cl.contractPrincipal(
//       //         "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK",
//       //         "token-susdt"
//       //       ),
//       //       Cl.contractPrincipal(
//       //         "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//       //         "token-wsbtc"
//       //       ),
//       //     ]),
//       //   ],
//       //   deployer
//       // );
//       // console.log(currentResult);
//       // @ts-ignore
//       // expect(prevResult.value.value).toBe(0);
//       // @ts-ignore
//       // expect(currentResult.value.value).toBeGreaterThan(0);
//     },
//     TIMEOUT
//   );

//   // it(
//   //   "can use at-block",
//   //   () => {
//   //     const hash =
//   //       "0x6d9cef16a6082c9ecb0a514f99987753e5ac065ba1cf7d25b4613a1be70fb0eb";

//   //     // const code = `(contract-call? .vault-contract-v2 get-nav (list 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc))`;
//   //     const code = `(at-block ${hash} (contract-call? .vault-contract-v2 get-nav (list 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt 'SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc)))`;
//   //     const { result } = simnet.execute(code);
//   //     console.log(">>>>>>>>>", result);
//   //     // expect(result).toBeSome(Cl.int(price2));
//   //   },
//   //   TIMEOUT
//   // );

//   //   // it("should calculate the correct NAV after depositing assets", () => {
//   //   //   // First, let's deposit some assets to the vault
//   //   //   const stxAmount = 1000000000; // 10 STX
//   //   //   const usdtAmount = 500000000; // 5 USDT
//   //   //   const sbtcAmount = 10000000; // 0.1 BTC

//   //   //   // Deposit STX
//   //   //   simnet.callPublicFn(
//   //   //     "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx",
//   //   //     "mint",
//   //   //     [Cl.uint(stxAmount), Cl.principal(deployer)],
//   //   //     deployer
//   //   //   );

//   //   //   simnet.callPublicFn(
//   //   //     "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wststx",
//   //   //     "transfer-fixed",
//   //   //     [
//   //   //       Cl.uint(stxAmount),
//   //   //       Cl.principal(deployer),
//   //   //       Cl.principal(`${deployer}.${CONTRACT_NAME}`),
//   //   //       Cl.none(),
//   //   //     ],
//   //   //     deployer
//   //   //   );

//   //   //   // Deposit USDT
//   //   //   simnet.callPublicFn(
//   //   //     "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt",
//   //   //     "mint",
//   //   //     [Cl.uint(usdtAmount), Cl.principal(deployer)],
//   //   //     deployer
//   //   //   );

//   //   //   simnet.callPublicFn(
//   //   //     "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-susdt",
//   //   //     "transfer-fixed",
//   //   //     [
//   //   //       Cl.uint(usdtAmount),
//   //   //       Cl.principal(deployer),
//   //   //       Cl.principal(`${deployer}.${CONTRACT_NAME}`),
//   //   //       Cl.none(),
//   //   //     ],
//   //   //     deployer
//   //   //   );

//   //   //   // Deposit sBTC
//   //   //   simnet.callPublicFn(
//   //   //     "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc",
//   //   //     "mint",
//   //   //     [Cl.uint(sbtcAmount), Cl.principal(deployer)],
//   //   //     deployer
//   //   //   );

//   //   //   simnet.callPublicFn(
//   //   //     "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC.token-wsbtc",
//   //   //     "transfer-fixed",
//   //   //     [
//   //   //       Cl.uint(sbtcAmount),
//   //   //       Cl.principal(deployer),
//   //   //       Cl.principal(`${deployer}.${CONTRACT_NAME}`),
//   //   //       Cl.none(),
//   //   //     ],
//   //   //     deployer
//   //   //   );

//   //   //   // Now call get-nav to calculate the total value
//   //   //   const { result } = simnet.callReadOnlyFn(
//   //   //     CONTRACT_NAME,
//   //   //     "get-nav",
//   //   //     [
//   //   //       Cl.list([
//   //   //         Cl.contractPrincipal(
//   //   //           "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//   //   //           "token-wststx"
//   //   //         ),
//   //   //         Cl.contractPrincipal(
//   //   //           "SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK",
//   //   //           "token-susdt"
//   //   //         ),
//   //   //         Cl.contractPrincipal(
//   //   //           "SP1E0XBN9T4B10E9QMR7XMFJPMA19D77WY3KP2QKC",
//   //   //           "token-wsbtc"
//   //   //         ),
//   //   //       ]),
//   //   //     ],
//   //   //     deployer
//   //   //   );

//   //   //   // Calculate expected NAV:
//   //   //   // STX: 10 STX * stStxPrice / 10^8 = 10 * 68068600 / 10^8 = 6.8068600
//   //   //   // USDT: 5 USDT * 1 = 5
//   //   //   // BTC: 0.1 BTC * btcPrice / 10^8 = 0.1 * 8223296507619 / 10^8 = 822329.6507619
//   //   //   // Total: 6.8068600 + 5 + 822329.6507619 = 822341.4576219
//   //   //   // But since we're working with integers, we expect 822341

//   //   //   const expectedNAV = 822341;
//   //   //   expect(result).toBeOk(Cl.uint(expectedNAV));
//   //   // });
// });
