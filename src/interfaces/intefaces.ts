import { CSSProperties } from 'react';

export interface Header {
  name: string;
  url: string;
}

export interface Filters {
  currentPage: number;
  sortBy: string;
  contentType: string;
  timeFilter: string;
  from: string;
  to: string;
  genesisBlock: number;
  tokens: string,
  account: string,
}

export interface FilterTag {
  text: string;
  type?: 'tag';
}

export interface FilterRange {
  type: 'range';
  max: number | 'max';
}

export interface FilterGenesis {
  type: 'genesis';
  text: string;
}

export interface FilterAccount {
  type: 'account';
  text: string;
}

export type Filter = FilterTag | FilterRange | FilterGenesis | FilterAccount;

export interface FilterConfig {
  activeColor: string;
  styles?: CSSProperties;
  filters: Filter[];
}

export interface AddressStats {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

interface FeeHistogram {
  fee: number;
  count: number;
}

export interface MemPool {
  count: number;
  total_fee: number;
  vsize: number;
  fee_histogram: FeeHistogram[][];
}

export interface BlockStatus {
  height: number;
  in_best_chain: boolean;
  next_best: string;
}
export interface BlockData extends BlockStatus {
  id: string;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash: string;
  mediantime: number;
  nonce: number;
  bits: number;
  difficulty: number;
}

export interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  size: number;
  weight: number;
  fee: number;
  status: TransactionStatus;
  vsize: number;
}

export interface Vin {
  txid: string;
  vout: number;
  prevout: Vout;
  scriptsig: string;
  scriptsig_asm: string;
  is_coinbase: boolean;
  sequence: number;
  scriptpubkey_asm: string;
  scriptpubkey_address: string;
  value: number;
}

export interface Vout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  txid: string;
  scriptpubkey_address: string;
  value: number;
  transaction: additionalFields;
}

export interface additionalFields {
  spent: boolean;
  txid: string;
  vin: 0;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
}

interface TransactionStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export interface TransactionData {
  txid: string;
  fee: number;
  vsize: number;
  value: number;
}

export interface TableData {
  latestBlock: BlockData[];
  latestTransactions: TransactionData[];
}

export interface Collection {
  image: string;
  collection: string;
  supply: number;
  fileSize: number;
  avgFileSize: number;
  creationFee: number;
  range: number[];
  creationDate: string;
}
