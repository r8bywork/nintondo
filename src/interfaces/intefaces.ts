import { CSSProperties } from 'react';

export interface Header {
  name: string;
  url: string;
}

export interface FilterConfig {
  activeColor: string;
  styles?: CSSProperties;
  filters: {
    text: string;
    isActive: boolean;
  }[];
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

export interface BlockData {
  id: string;
  height: number;
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
  in_best_chain: boolean;
  next_best: string;
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

export interface InscriptionInfo {
  id: string;
  ownedBy: string;
  fileType: string;
  fileSize: string;
  created: string;
  creationBlock: number;
  creationTransaction: string;
  creationFeeSats: number;
  tags: string;
}
