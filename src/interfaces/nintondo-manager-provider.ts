export interface INintondoManagerProvider {
  nintondoExists?: boolean;
  address?: string;
  connectWallet: () => Promise<string | undefined>;
  // signAllPsbtInputs: (psbtBase64: string) => Promise<string | undefined>;
  signTx: (txHex: string) => Promise<string | undefined>;
  signPsbtInputs: (
    psbtBase64: string,
    inputsToSign: number[],
    sigHashTypes?: number[][],
  ) => Promise<string | undefined>;
}
