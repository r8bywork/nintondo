export interface InscriptionInfo {
  number: number;
  id: string;
  owned_by: string;
  file_type: string;
  mime: string;
  file_size: number;
  created: string;
  ctreation_block: number;
  ctreation_transaction: string;
}

export interface InscriptionCards {
  pages: number;
  count: number;
  inscriptions: { number: number; id: string; file_type: string; created: string }[];
}
