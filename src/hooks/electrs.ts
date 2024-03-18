import { useCallback } from 'react';
import { ApiUTXO, Inscription } from '../interfaces/api';
import { fetchBELLMainnet } from '../utils';

export const useGetUserInscriptions = () => {
  return useCallback(async (address: string): Promise<Inscription[] | undefined> => {
    return await fetchBELLMainnet<Inscription[]>({
      path: `/address/${address}/ords`,
    });
  }, []);
};

export const useGetTransactionRawHex = () => {
  return useCallback(async (txId: string): Promise<string | undefined> => {
    return await fetchBELLMainnet<string>({
      path: `/tx/${txId}/hex`,
      json: false,
    });
  }, []);
};

export const useGetApiutxo = () => {
  return useCallback(async (addrses: string): Promise<ApiUTXO[] | undefined> => {
    return await fetchBELLMainnet<ApiUTXO[]>({
      path: `/address/${addrses}/utxo`,
    });
  }, []);
};
