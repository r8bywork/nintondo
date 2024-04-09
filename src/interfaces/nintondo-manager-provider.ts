import { Status } from './api';

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

export interface Ord {
  available_to_free: number;
  inscriptions: InscriptionMetaInfo[];
  status: Status;
  txid: string;
  value: number;
  vout: number;
  inscriptionIndex?: number;
  raw_hex: string;
  send?: boolean;
  verifiedSendAddress?: boolean;
  sendToAddress?: string;
}

export interface InscriptionMetaInfo {
  content_length: number;
  content_type: string;
  inscription_id: string;
  inscription_number: number;
  offset: number;
}

export interface Claims {
  address: string;
  exp: number;
}
