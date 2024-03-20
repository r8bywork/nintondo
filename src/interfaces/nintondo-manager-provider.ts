export interface INintondoManagerProvider {
  nintondoExists?: boolean;
  address?: string;
  connectWallet: () => Promise<string | undefined>;
  // signAllPsbtInputs: (psbtBase64: string) => Promise<string | undefined>;
  signPsbtInputs: (psbtBase64: string, options?: SignPsbtOptions) => Promise<string | undefined>;
  verifiedAddress: boolean;
  verifyAddress: () => Promise<void>;
  getPublicKey: () => Promise<string | undefined>;
  disconnect: () => Promise<void>;
}

interface BaseUserToSignInput {
  index: number;
  sighashTypes: number[] | undefined;
  disableTweakSigner?: boolean;
}

export interface AddressUserToSignInput extends BaseUserToSignInput {
  address: string;
}

export interface PublicKeyUserToSignInput extends BaseUserToSignInput {
  publicKey: string;
}

export type UserToSignInput = AddressUserToSignInput | PublicKeyUserToSignInput;

export interface SignPsbtOptions {
  autoFinalized: boolean;
  toSignInputs?: UserToSignInput[];
}

export interface ToSignInput {
  index: number;
  publicKey: string;
  sighashTypes?: number[];
}
