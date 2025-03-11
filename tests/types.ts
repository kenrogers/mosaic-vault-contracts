import { FungiblePostCondition, STXPostCondition } from "@stacks/transactions";

export type Currency = string & {
  readonly brand: unique symbol;
};
/** The `Currency` namespace contains predefined constants for tokens in the AlexSDK.*/
export declare namespace Currency {
  /** Represents the `STX` token */
  const STX: Currency;
  /** Represents the `ALEX` token*/
  const ALEX: Currency;
}

export type PoolData = {
  tokenX: Currency;
  tokenY: Currency;
  factor: bigint;
};

export type AMMRouteSegment = {
  from: Currency;
  neighbour: Currency;
  pool: PoolData;
};

export type AMMRoute = AMMRouteSegment[];

export interface DisplayInfo {
  route: AMMRoute;
  priceUSD?: number;
  amountTo?: bigint;
  min?: bigint | number | null;
  valueUSD?: number;
}
export type SwapInstruction = {
  helper: number;
  tokenX: string;
  tokenY: string;
  tokenZ: string | null;
  tokenW: string | null;
  tokenV: string | null;
  factorX: number;
  factorY: number;
  factorZ: number | null;
  factorW: number | null;
  dx: number;
  min: number;
};

export interface Result {
  totalSwapValueUSD: number;
  toPriceUSD: number | undefined;
  swapInstructions: SwapInstruction[];
  postConditions: Array<FungiblePostCondition | STXPostCondition>;
  displayInfo: DisplayInfo[];
  totalValueUSD: number;
  expectedTokens?: number | null;
}

export type ApprovedAssets = { asset: string; weight: number; id: number }[];
