import { TEST_API_URL } from '../consts';

export const fetchBELLMainnet = async <T>({
  path,
  json = true,
  ...props
}: fetchProps): Promise<T | undefined> => {
  const url = `${TEST_API_URL}${path}`;
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

export const fetchExplorer = async <T>({
  path,
  json = true,
  ...props
}: fetchProps): Promise<T | undefined> => {
  const url = `${'https://bells.quark.blue/'}${path}`;
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

type Params = {
  nPrefix?: number;
  nSuffix?: number;
  separator?: 'braces' | 'brackets' | 'parenthesis';
};
export const truncate = (str: string, { nPrefix = 4, nSuffix = 4 }: Params = {}) => {
  const nTotalIsLongerThanStr = nPrefix + nSuffix > str.length;
  return str && !nTotalIsLongerThanStr
    ? `${str.slice(0, nPrefix)}...${str.slice(str.length - nSuffix)}`
    : str;
};
