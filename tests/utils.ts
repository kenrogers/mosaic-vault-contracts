import { Result } from "./types";

export async function fetchPurchaseData(
  sender: string,
  fromId: string,
  amount: number | bigint,
  slippage: number | bigint,
  weights: { asset: string; weight: number | bigint }[],
  currentNav: number | bigint = 0
) {
  const purchaseData = await fetch(
    "http://localhost:3000/api/swap/purchase-data",
    {
      method: "POST",
      body: JSON.stringify({
        sender,
        fromId,
        amount: amount,
        slippage: slippage,
        weights: weights,
        currentNav,
      }),
    }
  );
  const data = (await purchaseData.json()) as Result;
  return data;
}

export async function fetchRedeemData(
  sender: string,
  toAsset: string,
  fromAssets: { asset: string; dx: number | bigint }[],
  slippage: number | bigint
) {
  const redeemData = await fetch("http://localhost:3000/api/swap/redeem-data", {
    method: "POST",
    body: JSON.stringify({
      sender,
      toAsset,
      slippage: slippage,
      fromAssets: fromAssets,
    }),
  });
  const data = (await redeemData.json()) as Result;
  return data;
}
