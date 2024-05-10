export interface InscriptionInfo {
  owner: string;
  number: number;
  id: string;
  owned_by: string;
  file_type: string;
  mime: string;
  file_size: number;
  created: number;
  creation_block: number;
  creation_transaction: string;
}

export interface InscriptionCards {
  pages: number;
  count: number;
  inscriptions: { number: number; id: string; file_type: string; created: number }[];
}

export interface InscriptionOwner {
  owner: string;
}
