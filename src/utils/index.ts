import { Split } from '@/interfaces/marketapi';
import { Ord } from '@/interfaces/nintondo-manager-provider';
import {
  CONTENT_API_URL,
  MARKET_API_URL,
  MARKET_HISTORY_API_URL,
  NINTONDO_API_URL,
} from '@/consts';
import { address as belAddress, payments } from 'belcoinjs-lib';
import { Filters } from '@/interfaces/intefaces.ts';
import toast from 'react-hot-toast';

export const fetchBELLMainnet = async <T>({
  path,
  json = true,
  ...props
}: fetchProps): Promise<T | undefined> => {
  const url = `${NINTONDO_API_URL}${path}`;
  const res = await fetch(url.toString(), { ...props });

  if (!json) return (await res.text()) as T;

  return await res.json();
};

export const fetchMarket = async <T>({
  path,
  json = true,
  ...props
}: fetchProps): Promise<T | undefined> => {
  const url = `${MARKET_API_URL}${path}`;
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

export const fetchContent = async <T>({
  path,
  json = true,
  ...props
}: fetchProps): Promise<T | undefined> => {
  const url = `${CONTENT_API_URL}/${path}`;
  const res = await fetch(url.toString(), { ...props });

  if (!json) return (await res.text()) as T;

  return await res.json();
};
export const fetchInscriptionOwner = async <T>({
  path,
  json = true,
  ...props
}: fetchProps): Promise<T | undefined> => {
  const url = `${MARKET_HISTORY_API_URL}/${path}`;
  const res = await fetch(url.toString(), { ...props });

  if (!res.ok) return;
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

export function isValidBitcoinAddress(address: string) {
  try {
    belAddress.toOutputScript(address);
    return true;
  } catch (e) {
    return false;
  }
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

export const createHref = (newFilters: Partial<Filters>, currentParams: URLSearchParams) => {
  const params = new URLSearchParams(currentParams);
  Object.entries(newFilters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, value.toString());
    }
  });
  return params.toString();
};

export const scrollToTopExplorerTable = () => {
  const tableTop = document.getElementById('explorer')?.getBoundingClientRect();
  const headerHeight = document.getElementById('header')?.getBoundingClientRect().height;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const top = tableTop!.top + scrollTop - headerHeight! - 5;
  window.scrollTo({
    top,
    behavior: 'smooth',
  });
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1000) return bytes + ' bytes';
  else if (bytes < 1000 ** 2) return (bytes / 1000).toFixed(2) + ' KB';
  else if (bytes < 1000 ** 3) return (bytes / 1000 ** 2).toFixed(2) + ' MB';
  else if (bytes < 1000 ** 4) return (bytes / 1000 ** 3).toFixed(2) + ' GB';
  else return (bytes / 1000 ** 4).toFixed(2) + ' TB';
};

export const formattedStringFromTimestamp = (timestamp: number) => {
  const now = Date.now();
  const millisecondsPerMinute = 1000 * 60;
  const millisecondsPerHour = millisecondsPerMinute * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;
  const millisecondsPerYear = millisecondsPerDay * 365.25; // Adjust for leap years

  const elapsed = now - timestamp * 1000; // Convert timestamp to milliseconds

  if (elapsed < millisecondsPerMinute) {
    const seconds = Math.floor(elapsed / 1000);
    return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
  } else if (elapsed < millisecondsPerDay) {
    const hours = Math.floor(elapsed / millisecondsPerHour);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    const minutes = Math.floor(elapsed / millisecondsPerMinute);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else if (elapsed >= millisecondsPerYear) {
    const years = Math.floor(elapsed / millisecondsPerYear);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(elapsed / millisecondsPerDay);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export const filterOrdsAndFindUnmatchedSplits = (
  ords: Ord[],
  splits: Split[],
): { filteredOrds: Ord[]; unmatchedSplits: Split[] } => {
  const ordLocations = new Set(ords.map((ord) => `${ord.txid}:${ord.vout}`));
  const unmatchedSplits: Split[] = [];
  const filteredOrds = ords.filter((ord) => {
    const isMatched = splits.some((split) => split.locations.includes(`${ord.txid}:${ord.vout}`));
    return !isMatched;
  });

  splits.forEach((split) => {
    const hasMatch = split.locations.some((location) => ordLocations.has(location));
    if (!hasMatch) {
      unmatchedSplits.push(split);
    }
  });

  return { filteredOrds, unmatchedSplits };
};

export const convertTimestampToFormattedDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'GMT',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const formattedDate = date.toLocaleDateString('en-US', options) + ' GMT+3';
  return formattedDate;
};

export const shareData = () => {
  const url = window.location.href;

  if (navigator.share) {
    navigator
      .share({
        title: 'Nintondo',
        url: url,
      })
      .then(() => {
        return 0;
      })
      .catch((error) => console.log('Ошибка при попытке поделиться', error));
  } else {
    copyToClipboard(url);
  }
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => toast('Copied!'),
    (error) => console.log(error),
  );
};
