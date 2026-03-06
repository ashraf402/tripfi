import bchaddr from "bchaddrjs";
import * as bip39 from "bip39";
import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import { payments, networks } from "bitcoinjs-lib";
import { getMnemonic } from "./crypto";
import { getEndpoints } from "./endpoints";

// Network config

export type BCHNetwork = "testnet" | "mainnet";

export const NETWORK: BCHNetwork =
  (process.env.BCH_NETWORK as BCHNetwork) ?? "testnet";

export const IS_TESTNET = NETWORK === "testnet";

const NETWORK_CONFIG = {
  testnet: { label: "Testnet" },
  mainnet: { label: "Mainnet" },
} as const;

// const NETWORK_CONFIG = {
//   testnet: {
//     network: bitcoin.networks.testnet,
//     label: "Testnet",
//   },
//   mainnet: {
//     network: bitcoin.networks.bitcoin,
//     label: "Mainnet",
//   },
// } as const;

export const activeNetwork = NETWORK_CONFIG[NETWORK];

export function getActiveEndpoints() {
  return getEndpoints(IS_TESTNET);
}

const bip32 = BIP32Factory(ecc);
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
  const root = bip32.fromSeed(seed);
  const path = `m/44'/145'/0'/0/${bookingIndex}`;
  const child = root.derivePath(path);
  const { address: legacyAddress } = payments.p2pkh({
    pubkey: Buffer.from(child.publicKey),
    network: IS_TESTNET ? networks.testnet : networks.bitcoin,
  });
  const cashAddress = legacyToCashAddr(legacyAddress!);
  return { address: cashAddress, derivationPath: path, network: NETWORK };
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
