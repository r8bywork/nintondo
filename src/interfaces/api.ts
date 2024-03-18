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
