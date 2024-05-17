import { CSSProperties } from 'react';
import { ApiOrdUTXO, ApiUTXO } from './api';

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

export type IFilter = FilterTag | FilterRange | FilterGenesis;

export interface FilterConfig {
  activeColor: string;
  styles?: CSSProperties;
  filters: IFilter[];
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

export interface ITransfer {
  inscription_id: string;
  amount: number;
  number: number;
}

export interface IToken {
  tick: string;
  balance: number;
  transferable_balance: number;
  transfers: ITransfer[];
}

export interface GitHubRelease {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: GitHubUser;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: GitHubAsset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface GitHubAsset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string | null;
  uploader: GitHubUser;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

export interface PreparedToBuyInscription {
  inscription: { address: string; price: number };
  sellerOrdUtxo: ApiOrdUTXO;
  utxos: ApiUTXO[];
}
