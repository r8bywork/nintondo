export interface IDummyInscription {
  inscription_id: string;
  address: string;
  txid: string;
  price: number;
}

export interface IListInscriptions {
  psbt_base64: string;
}

export interface IBuyInscription {
  txid?: string;
  confirmed: boolean;
}

export interface PushSplit {
  transaction_hex: string;
  locations: string[];
}

export interface Split {
  txid: string;
  locations: string[];
}

export interface ListedToken {
  tick: string;
  amount: number;
  outpoint: string;
  price: number;
}

export interface ListedTokenCard {
  pages: number;
  count: number;
  tokens: ListedToken[];
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
  fullPrice: string;
}

export interface MarketplaceTokensView {
  current_page: number;
  total_pages: number;
  tokens: Array<MarketplaceTokenView>;
}

export interface MarketplaceOrder {
  buyer: string | null;
  date: number; // timestamp in seconds
  event: 'Listed' | 'Sold' | 'Unlisted';
  outpoint: string;
  price: number;
  receiver: string | null;
  seller: string;
}

export interface MarketplaceOrders {
  current_page: number;
  total_pages: number;
  orders: MarketplaceOrder[];
}
