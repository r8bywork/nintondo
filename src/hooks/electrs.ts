import { ApiOrdUTXO, ApiUTXO, Inscription } from '../interfaces/api';
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

export const searchInscriptoins = async (address: string, txid: string) => {
  return await fetchBELLMainnet<ApiOrdUTXO[]>({
    path: `/address/${address}/ords?search=${txid}`,
  });
};
