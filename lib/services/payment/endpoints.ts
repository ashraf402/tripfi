export type ExplorerProvider =
  | "fullstack"
  | "blockexplorer"
  | "blockchair"
  | "blockchain";

export interface ExplorerEndpoint {
  name: string;
  balanceApi: string;
  txApi: string;
  explorerTx: string;
  provider: ExplorerProvider;
}

export const TESTNET_ENDPOINTS: ExplorerEndpoint[] = [
  {
    name: "FullStack.cash Testnet3",
    balanceApi: "https://testnet3.fullstack.cash/v4/electrumx/balance",
    txApi: "https://testnet3.fullstack.cash/v4/electrumx/transactions",
    explorerTx: "https://blockexplorer.one/bitcoin-cash/testnet/tx",
    provider: "fullstack",
  },
  {
    name: "BlockExplorer.one",
    balanceApi: "https://api.blockexplorer.one/v1/bch/testnet/address",
    txApi: "https://api.blockexplorer.one/v1/bch/testnet/address",
    explorerTx: "https://blockexplorer.one/bitcoin-cash/testnet/tx",
    provider: "blockexplorer",
  },
];

export const MAINNET_ENDPOINTS: ExplorerEndpoint[] = [
  {
    name: "FullStack.cash Mainnet",
    balanceApi: "https://bchn.fullstack.cash/v4/electrumx/balance",
    txApi: "https://bchn.fullstack.cash/v4/electrumx/transactions",
    explorerTx: "https://blockchair.com/bitcoin-cash/transaction",
    provider: "fullstack",
  },
  {
    name: "Blockchair",
    balanceApi: "https://api.blockchair.com/bitcoin-cash/dashboards/address",
    txApi: "https://api.blockchair.com/bitcoin-cash/dashboards/address",
    explorerTx: "https://blockchair.com/bitcoin-cash/transaction",
    provider: "blockchair",
  },
  {
    name: "Blockchain.info",
    balanceApi: "https://blockchain.info/rawaddr",
    txApi: "https://blockchain.info/rawaddr",
    explorerTx: "https://www.blockchain.com/bch/tx",
    provider: "blockchain",
  },
];

// Returns endpoint list for active network
export function getEndpoints(isTestnet: boolean): ExplorerEndpoint[] {
  return isTestnet ? TESTNET_ENDPOINTS : MAINNET_ENDPOINTS;
}

// Returns primary explorer tx URL for showing user links
export function getPrimaryExplorerTxUrl(
  isTestnet: boolean,
  txHash: string,
): string {
  const endpoints = getEndpoints(isTestnet);
  return `${endpoints[0].explorerTx}/${txHash}`;
}
