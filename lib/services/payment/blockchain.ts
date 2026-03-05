import { IS_TESTNET, NETWORK } from "./bchPayment";
import { getPrimaryExplorerTxUrl } from "./endpoints";
import type { PaymentStatus } from "./bchPayment";

const MIN_CONFIRMATIONS = NETWORK === "mainnet" ? 3 : 0;

// Electrum Cash servers ranked by reliability.
// Protocol: ssl (raw TCP+TLS).
// Standard Fulcrum/ElectrumX port convention:
//   Mainnet SSL → 50002
//   Testnet SSL → 60002

const TESTNET_SERVERS = [
  {
    host: "testnet.imaginary.cash",
    port: 60002,
    protocol: "ssl" as const,
  },
  {
    host: "blackie.c3-soft.com",
    port: 60002,
    protocol: "ssl" as const,
  },
  {
    host: "bch0.kister.net",
    port: 51002,
    protocol: "ssl" as const,
  },
];

const MAINNET_SERVERS = [
  {
    host: "fulcrum.fountainhead.cash",
    port: 50002,
    protocol: "ssl" as const,
  },
  {
    host: "bch.imaginary.cash",
    port: 50002,
    protocol: "ssl" as const,
  },
  {
    host: "electroncash.de",
    port: 50002,
    protocol: "ssl" as const,
  },
];

interface ElectrumBalance {
  confirmed: number; // satoshis
  unconfirmed: number; // satoshis
}

interface ElectrumTx {
  tx_hash: string;
  height: number; // 0 = unconfirmed
}

async function queryElectrum(address: string): Promise<{
  balance: ElectrumBalance;
  history: ElectrumTx[];
}> {
  const ElectrumClient =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@keep-network/electrum-client-js");

  const servers = IS_TESTNET ? TESTNET_SERVERS : MAINNET_SERVERS;

  // Strip bchtest: or bitcoincash: prefix.
  // Electrum servers use the raw address
  // without the network prefix.
  const rawAddress = address
    .replace("bchtest:", "")
    .replace("bitcoincash:", "");

  let lastError: Error | null = null;

  for (const server of servers) {
    let client: any = null;
    try {
      client = new ElectrumClient(server.host, server.port, server.protocol);

      await client.connect("TripFi", "1.4.3");

      const balance: ElectrumBalance =
        await client.blockchain_address_getBalance(rawAddress);

      const history: ElectrumTx[] =
        await client.blockchain_address_getHistory(rawAddress);

      await client.close();

      console.info(
        `[BCH] Electrum ${server.host}: ` +
          `confirmed=${balance.confirmed} sat, ` +
          `unconfirmed=${balance.unconfirmed} sat`,
      );

      return { balance, history };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      console.warn(
        `[BCH] Electrum ${server.host} failed: ` +
          `${lastError.message}, trying next...`,
      );

      try {
        await client?.close();
      } catch {
        // ignore close errors
      }

      continue;
    }
  }

  throw new Error(
    `All Electrum servers failed. ` + `Last: ${lastError?.message}`,
  );
}

export async function checkAddressReceived(
  address: string,
  expectedBch: number,
): Promise<PaymentStatus> {
  try {
    const { balance, history } = await queryElectrum(address);

    const confirmedSat = balance.confirmed ?? 0;
    const unconfirmedSat = balance.unconfirmed ?? 0;
    const totalSat = confirmedSat + unconfirmedSat;

    // 0-conf on testnet: count everything
    // 3-conf on mainnet: confirmed only
    const effectiveSat = MIN_CONFIRMATIONS === 0 ? totalSat : confirmedSat;

    const receivedBch = totalSat / 1e8;
    const effectiveBch = effectiveSat / 1e8;
    const confirmed = effectiveBch >= expectedBch;

    // Most recent tx — height > 0 = mined
    const latestTx = history?.[0];
    const txHash = latestTx?.tx_hash;
    const isMined = latestTx?.height != null && latestTx.height > 0;

    console.info(
      `[BCH] Payment check: ` +
        `received=${receivedBch.toFixed(8)} BCH, ` +
        `expected=${expectedBch} BCH, ` +
        `mined=${isMined}, ` +
        `confirmed=${confirmed}`,
    );

    return {
      status: confirmed ? "confirmed" : "pending",
      receivedBch,
      expectedBch,
      confirmations: isMined ? 1 : 0,
      txHash,
      explorerUrl: txHash
        ? getPrimaryExplorerTxUrl(IS_TESTNET, txHash)
        : undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    console.error(`[BCH] All servers failed: ${message}`);

    // Return pending not error —
    // polling will retry in 5 seconds
    return {
      status: "pending",
      receivedBch: 0,
      expectedBch,
      confirmations: 0,
    };
  }
}
