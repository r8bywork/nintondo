import { ApiUTXO, Inscription } from '../interfaces/api';
import { fetchBELLMainnet } from '../utils';

export const getUserInscriptions = async (address: string) => {
  return await fetchBELLMainnet<Inscription[]>({
    path: `/address/${address}/ords`,
  });
};

export const getTransactionRawHex = async (txId: string) => {
  return await fetchBELLMainnet<string>({
    path: `/tx/${txId}/hex`,
    json: false,
  });
};

export const getApiUtxo = async (address: string) => {
  return await fetchBELLMainnet<ApiUTXO[]>({
    path: `/address/${address}/utxo`,
  });
};
