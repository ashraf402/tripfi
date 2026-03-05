import * as bip39 from "bip39";
import * as bitcoin from "bitcoincashjs-lib";
import bchaddr from "bchaddrjs";
import { getMnemonic } from "./crypto";
import {
  getEndpoints,
  getPrimaryExplorerTxUrl,
  type ExplorerEndpoint,
} from "./endpoints";

// Network config

export type BCHNetwork = "testnet" | "mainnet";

export const NETWORK: BCHNetwork =
  (process.env.BCH_NETWORK as BCHNetwork) ?? "testnet";

export const IS_TESTNET = NETWORK === "testnet";

const MIN_CONFIRMATIONS = NETWORK === "mainnet" ? 3 : 0;

const NETWORK_CONFIG = {
  testnet: {
    network: bitcoin.networks.testnet,
    label: "Testnet",
  },
  mainnet: {
    network: bitcoin.networks.bitcoin,
    label: "Mainnet",
  },
} as const;

export const activeNetwork = NETWORK_CONFIG[NETWORK];

export function getActiveEndpoints() {
  return getEndpoints(IS_TESTNET);
}

// Types

export interface PaymentAddress {
  address: string;
  derivationPath: string;
  network: BCHNetwork;
}

export interface PaymentStatus {
  status: "pending" | "confirmed" | "failed";
  receivedBch: number;
  expectedBch: number;
  confirmations: number;
  txHash?: string;
  explorerUrl?: string;
}

export interface PaymentInvoice {
  bookingId: string;
  paymentAddress: string;
  amountBch: number;
  amountUsd: number;
  bchRate: number;
  network: BCHNetwork;
  networkLabel: string;
  explorerUrl: string;
}

// HD Wallet
// BIP44 derivation: m/44'/145'/0'/0/{index}
// 145 = BCH coin type
// Each booking index gets a unique address

function legacyToCashAddr(legacyAddress: string): string {
  try {
    // toCashAddress() detects network from the legacy address version byte:
    //   version 0   → mainnet → bitcoincash:q...
    //   version 111 → testnet → bchtest:q...
    // No need to branch on IS_TESTNET.
    return bchaddr.toCashAddress(legacyAddress);
  } catch (err) {
    throw new Error(`Failed to convert address to CashAddr: ${err}`);
  }
}

export async function generatePaymentAddress(
  bookingIndex: number,
): Promise<PaymentAddress> {
  const mnemonic = getMnemonic();

  const seed = await bip39.mnemonicToSeed(mnemonic);

  const root = bitcoin.HDNode.fromSeedBuffer(seed, activeNetwork.network);

  const path = `m/44'/145'/0'/0/${bookingIndex}`;
  const child = root.derivePath(path);

  const legacyAddress = child.getAddress();
  const cashAddress = legacyToCashAddr(legacyAddress);

  return {
    address: cashAddress,
    derivationPath: path,
    network: NETWORK,
  };
}

// Address Validation

export function isValidBCHAddress(address: string): boolean {
  try {
    if (!bchaddr.isValidAddress(address)) {
      return false;
    }
    if (IS_TESTNET) {
      return bchaddr.isTestnetAddress(address);
    } else {
      return bchaddr.isMainnetAddress(address);
    }
  } catch {
    return false;
  }
}

// Normalised shape returned by all provider normalisers
interface NormalisedData {
  received: number; // in BCH, not satoshis
  txHash: string | undefined;
  confs: number;
}

function normaliseBlockExplorer(data: any, _address: string): NormalisedData {
  if (!data || data.totalReceived == null) {
    throw new Error("Invalid blockexplorer response");
  }
  return {
    received: (data.totalReceived ?? 0) / 1e8,
    txHash: data.txs?.[0]?.txid,
    confs: data.txs?.[0]?.confirmations ?? 0,
  };
}

function normaliseBlockchainInfo(data: any): NormalisedData {
  if (!data || data.total_received == null) {
    throw new Error("Invalid blockchain.info response");
  }
  return {
    received: (data.total_received ?? 0) / 1e8,
    txHash: data.txs?.[0]?.hash,
    confs: data.txs?.[0]?.confirmations ?? 0,
  };
}

function normaliseBlockchair(data: any, _address: string): NormalisedData {
  const addrKey = Object.keys(data?.data ?? {})[0];
  const addrData = data?.data?.[addrKey]?.address;

  if (!addrData) {
    throw new Error("Invalid blockchair response");
  }

  const txids: string[] = data?.data?.[addrKey]?.transactions ?? [];

  return {
    received: (addrData.received ?? 0) / 1e8,
    txHash: txids[0],
    // blockchair address endpoint does not return confirmations
    // treat all blockchair responses as 0-conf
    confs: 0,
  };
}

function normaliseFullstack(balanceData: any, txData: any): NormalisedData {
  if (!balanceData?.success) {
    throw new Error("Invalid FullStack.cash balance response");
  }

  const confirmed = balanceData.balance?.confirmed ?? 0;
  const unconfirmed = balanceData.balance?.unconfirmed ?? 0;
  const totalSat = confirmed + unconfirmed;

  const txHash = txData?.transactions?.[0]?.tx_hash;

  // height > 0 means mined in a block
  const height = txData?.transactions?.[0]?.height ?? 0;
  const confs = height > 0 ? 1 : 0;

  return {
    received: totalSat / 1e8,
    txHash,
    confs,
  };
}

function normalise(
  provider: ExplorerEndpoint["provider"],
  balanceData: any,
  txData: any,
  address: string,
): NormalisedData {
  switch (provider) {
    case "fullstack":
      return normaliseFullstack(balanceData, txData);
    case "blockexplorer":
      return normaliseBlockExplorer(balanceData, address);
    case "blockchair":
      return normaliseBlockchair(balanceData, address);
    case "blockchain":
      return normaliseBlockchainInfo(balanceData);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function buildAddressUrl(
  endpoint: ExplorerEndpoint,
  address: string,
): { balanceUrl: string; txUrl: string } {
  switch (endpoint.provider) {
    case "fullstack": {
      // FullStack.cash uses separate endpoints for balance and transactions.
      // Strip bchtest: or bitcoincash: prefix for the URL path.
      const cleanAddress = address
        .replace("bchtest:", "")
        .replace("bitcoincash:", "");
      return {
        balanceUrl: `${endpoint.balanceApi}/${cleanAddress}`,
        txUrl: `${endpoint.txApi}/${cleanAddress}`,
      };
    }
    case "blockexplorer":
      return {
        balanceUrl: `${endpoint.balanceApi}/${address}`,
        txUrl: `${endpoint.balanceApi}/${address}`,
      };
    case "blockchair":
      return {
        balanceUrl: `${endpoint.balanceApi}/${address}`,
        txUrl: `${endpoint.balanceApi}/${address}`,
      };
    case "blockchain":
      return {
        balanceUrl: `${endpoint.balanceApi}/${address}`,
        txUrl: `${endpoint.balanceApi}/${address}`,
      };
    default:
      throw new Error(`Unknown provider: ${endpoint.provider}`);
  }
}

export async function checkAddressReceived(
  address: string,
  expectedBch: number,
): Promise<PaymentStatus> {
  const endpoints = getEndpoints(IS_TESTNET);
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const { balanceUrl, txUrl } = buildAddressUrl(endpoint, address);

      // Fetch balance
      const balanceRes = await fetch(balanceUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });

      if (!balanceRes.ok) {
        lastError = new Error(
          `${endpoint.name} balance returned ${balanceRes.status}`,
        );
        console.warn(
          `[BCH] ${endpoint.name} failed (${balanceRes.status}), trying next...`,
        );
        continue;
      }

      const balanceData = await balanceRes.json();

      // Fetch transactions separately only for fullstack —
      // other providers return both in the same response.
      let txData = balanceData;
      if (endpoint.provider === "fullstack") {
        try {
          const txRes = await fetch(txUrl, {
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
          });
          if (txRes.ok) {
            txData = await txRes.json();
          }
        } catch {
          // txData stays as balanceData — txHash will be undefined,
          // but payment detection still works via balance amount.
        }
      }

      const { received, txHash, confs } = normalise(
        endpoint.provider,
        balanceData,
        txData,
        address,
      );

      const confirmed = received >= expectedBch && confs >= MIN_CONFIRMATIONS;

      console.info(
        `[BCH] Payment check via ${endpoint.name}: ` +
          `received=${received} BCH, ` +
          `expected=${expectedBch} BCH, ` +
          `confs=${confs}, ` +
          `confirmed=${confirmed}`,
      );

      return {
        status: confirmed ? "confirmed" : "pending",
        receivedBch: received,
        expectedBch,
        confirmations: confs,
        txHash,
        explorerUrl: txHash
          ? getPrimaryExplorerTxUrl(IS_TESTNET, txHash)
          : undefined,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(
        `[BCH] ${endpoint.name} error: ${lastError.message}, trying next...`,
      );
      continue;
    }
  }

  // All endpoints failed
  console.error(
    "[BCH] All explorer endpoints failed. " +
      `Last error: ${lastError?.message}`,
  );

  return {
    status: "pending",
    receivedBch: 0,
    expectedBch,
    confirmations: 0,
  };
}

// Helper to build a status object cleanly
function buildStatus(
  status: PaymentStatus["status"],
  receivedBch: number,
  expectedBch: number,
): PaymentStatus {
  return {
    status,
    receivedBch,
    expectedBch,
    confirmations: 0,
  };
}

// BCH Amount Calculation

export async function getBCHAmountForUsd(
  usdAmount: number,
): Promise<{ amountBch: number; rate: number }> {
  const { getBchRate } = await import("@/lib/services/bchRate");

  const rate = await getBchRate();

  // Round up to 8 decimal places
  const amountBch = Math.ceil((usdAmount / rate) * 1e8) / 1e8;

  return { amountBch, rate };
}

// QR Code URI
// Standard BIP21 URI for BCH QR codes
// Works with any BCH wallet scanner

export function buildBCHPaymentURI(
  address: string,
  amountBch: number,
  label?: string,
): string {
  // address already contains its CashAddr prefix
  // e.g. bchtest:q... or bitcoincash:q...
  let uri = `${address}?amount=${amountBch.toFixed(8)}`;

  if (label) {
    uri += `&label=${encodeURIComponent(label)}`;
  }

  return uri;
}

// Invoice Builder
// Combines all the above into one clean call
// Used by /api/bookings/create route

export async function buildPaymentInvoice(
  bookingId: string,
  bookingIndex: number,
  usdAmount: number,
  description?: string,
): Promise<PaymentInvoice> {
  const [{ address }, { amountBch, rate }] = await Promise.all([
    generatePaymentAddress(bookingIndex),
    getBCHAmountForUsd(usdAmount),
  ]);

  return {
    bookingId,
    paymentAddress: address,
    amountBch,
    amountUsd: usdAmount,
    bchRate: rate,
    network: NETWORK,
    networkLabel: activeNetwork.label,
    explorerUrl: getActiveEndpoints()[0].explorerTx,
  };
}

// Mnemonic Generator (run once, save to .env)
// Call this from a one-off script to generate
// your wallet seed. NEVER call in app code.
// node -e "require('./lib/services/payment/bchPayment').generateMnemonic()"

export function generateMnemonic(): string {
  const mnemonic = bip39.generateMnemonic(256);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("BCH_WALLET_MNEMONIC (save to .env):");
  console.log(mnemonic);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("NEVER share or commit this phrase.");
  return mnemonic;
}
