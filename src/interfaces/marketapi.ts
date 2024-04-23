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
