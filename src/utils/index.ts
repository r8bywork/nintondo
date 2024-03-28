import { payments } from 'belcoinjs-lib';
// import { TEST_API_URL } from '../consts';

export const fetchBELLMainnet = async <T>({
  path,
  json = true,
  ...props
}: fetchProps): Promise<T | undefined> => {
  const url = `${'http://localhost:3001'}${path}`;
  const res = await fetch(url.toString(), { ...props });

  if (!json) return (await res.text()) as T;

  return await res.json();
};

export const fetchMarket = async <T>({
  path,
  json = true,
  ...props
}: fetchProps): Promise<T | undefined> => {
  const url = `${'http://localhost:3002'}${path}`;
  const res = await fetch(url.toString(), { ...props });

  if (!json) return (await res.text()) as T;

  return await res.json();
};

interface fetchProps extends RequestInit {
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  path: string;
  params?: Record<string, string>;
  error?: boolean;
  json?: boolean;
}

export function shortAddress(address?: string, len = 5) {
  if (!address) return '';
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + '...' + address.slice(address.length - len);
}

export function calculateTxBytesFeeWithRate(
  vinsLength: number,
  voutsLength: number,
  feeRate: number,
): number {
  const baseTxSize = 10;
  const inSize = 180;
  const outSize = 34;

  const txSize = baseTxSize + vinsLength * inSize + voutsLength * outSize + 1 * outSize;
  const fee = txSize * feeRate;
  return fee;
}

export function gptFeeCalculate(inputCount: number, outputCount: number, feeRate: number) {
  // Constants defining the weight of each component of a transaction
  const BASE_TX_WEIGHT = 10 * 4; // 10 vbytes * 4 weight units per vbyte
  const INPUT_WEIGHT = 148 * 4; // 148 vbytes * 4 weight units per vbyte for each input
  const OUTPUT_WEIGHT = 34 * 4; // 34 vbytes * 4 weight units per vbyte for each output

  // Calculate the weight of the transaction
  const transactionWeight =
    BASE_TX_WEIGHT + inputCount * INPUT_WEIGHT + outputCount * OUTPUT_WEIGHT;

  // Calculate the fee by multiplying transaction weight by fee rate (satoshis per weight unit)
  const fee = Math.ceil((transactionWeight / 4) * feeRate);

  return fee;
}

export function getAddress(publicKey: Uint8Array, addressType: AddressType) {
  if (addressType === undefined) throw new Error('addressType of keyring is not specified');
  switch (addressType) {
    case AddressType.P2WPKH:
      return payments.p2wpkh({ pubkey: Buffer.from(publicKey) }).address;
    case AddressType.P2SH_P2WPKH:
      return payments.p2sh({
        redeem: payments.p2wpkh({ pubkey: Buffer.from(publicKey) }),
      }).address;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case AddressType.P2PKH as any:
      return payments.p2pkh({ pubkey: Buffer.from(publicKey) }).address;
    default:
      throw new Error('Invalid AddressType');
  }
}

export enum AddressType {
  P2PKH,
  P2WPKH,
  P2TR,
  P2SH_P2WPKH,
  M44_P2WPKH,
  M44_P2TR,
}
