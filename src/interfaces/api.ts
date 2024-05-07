export interface ApiOrdUTXO extends ApiUTXO {
  content_type: string;
  content_length: number;
  inscription_id: string;
  inscription_number: number;
  offset: number;
  owner: string;
  rawTx?: string;
}

export interface Inscription extends ApiOrdUTXO {
  preview: string;
  content: string;
  offset: 0;
}

export interface CompletedInscription extends Inscription {
  genesis: string;
  outpoint: string;
}

export interface ApiUTXO {
  txid: string;
  vout: number;
  status?: Status;
  value: number;
  rawHex?: string;
}

export interface Status {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export interface Fees {
  fast: number;
  slow: number;
}

export interface Listed {
  tick: string;
  token_numbers: number[];
}

export interface MarketplaceToken {
  number: number;
  amount: number;
  outpoint: string;
  price_per_token: number;
  owner: string;
}

export interface MarketplaceTokens {
  current_page: number;
  total_pages: number;
  tokens: MarketplaceToken[];
}

export interface MarketplaceTokenView extends MarketplaceToken {
  shortenOutpoint: string;
}

export interface MarketplaceTokensView {
  current_page: number;
  total_pages: number;
  tokens: Array<MarketplaceTokenView>;
}

export interface SplitHistoryItem {
  txid: string;
  locations: string[];
  confirmed: boolean;
}
