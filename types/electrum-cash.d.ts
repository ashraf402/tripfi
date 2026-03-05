// Type shim for @keep-network/electrum-client-js.
// CJS-only package with no TypeScript types.
declare module "@keep-network/electrum-client-js" {
  class ElectrumClient {
    constructor(host: string, port: number, protocol: string);
    connect(clientName: string, protocolVersion: string): Promise<void>;
    close(): Promise<void>;
    blockchain_address_getBalance(
      address: string,
    ): Promise<{ confirmed: number; unconfirmed: number }>;
    blockchain_address_getHistory(
      address: string,
    ): Promise<Array<{ tx_hash: string; height: number }>>;
    request(method: string, params: unknown[]): Promise<unknown>;
  }
  export = ElectrumClient;
}
