import * as bip39 from "bip39";
import * as bitcoin from "bitcoincashjs-lib";
import { getMnemonic } from "./crypto";

// Network config

export type BCHNetwork = "testnet" | "mainnet";

export const NETWORK: BCHNetwork =
  (process.env.BCH_NETWORK as BCHNetwork) ?? "testnet";

export const IS_TESTNET = NETWORK === "testnet";

const MIN_CONFIRMATIONS = NETWORK === "mainnet" ? 3 : 0;

const NETWORK_CONFIG = {
  testnet: {
    network: bitcoin.networks.testnet,
    explorerApi: "https://testnet.blockchain.info",
    explorerUrl: "https://www.blockchain.com/bch-testnet/tx",
    label: "Testnet",
  },
  mainnet: {
    network: bitcoin.networks.bitcoin,
    explorerApi: "https://blockchain.info",
    explorerUrl: "https://www.blockchain.com/bch/tx",
    label: "Mainnet",
  },
} as const;

export const activeNetwork = NETWORK_CONFIG[NETWORK];

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

export async function generatePaymentAddress(
  bookingIndex: number,
): Promise<PaymentAddress> {
  const mnemonic = getMnemonic();

  const seed = await bip39.mnemonicToSeed(mnemonic);

  const root = bitcoin.HDNode.fromSeedBuffer(seed, activeNetwork.network);

  const path = `m/44'/145'/0'/0/${bookingIndex}`;
  const child = root.derivePath(path);

  return {
    address: child.getAddress(),
    derivationPath: path,
    network: NETWORK,
  };
}

// Address Validation

export function isValidBCHAddress(address: string): boolean {
  try {
    bitcoin.address.toOutputScript(address, activeNetwork.network);
    return true;
  } catch {
    return false;
  }
}

// Blockchain Polling

export async function checkAddressReceived(
  address: string,
  expectedBch: number,
): Promise<PaymentStatus> {
  try {
    const res = await fetch(`${activeNetwork.explorerApi}/rawaddr/${address}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return buildStatus("pending", 0, expectedBch);
    }

    const data = await res.json();

    // total_received is in satoshis
    const receivedBch = (data.total_received ?? 0) / 1e8;

    // Get latest tx hash for explorer link
    const txHash = data.txs?.[0]?.hash ?? undefined;
    const confirmations = data.txs?.[0]?.confirmations ?? 0;

    const confirmed =
      receivedBch >= expectedBch && confirmations >= MIN_CONFIRMATIONS;

    return {
      status: confirmed ? "confirmed" : "pending",
      receivedBch,
      expectedBch,
      confirmations,
      txHash,
      explorerUrl: txHash
        ? `${activeNetwork.explorerUrl}/${txHash}`
        : undefined,
    };
  } catch {
    return buildStatus("failed", 0, expectedBch);
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
  const params = new URLSearchParams({
    amount: amountBch.toFixed(8),
    ...(label ? { label } : {}),
  });

  return `bitcoincash:${address}?${params.toString()}`;
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
    explorerUrl: activeNetwork.explorerUrl,
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
