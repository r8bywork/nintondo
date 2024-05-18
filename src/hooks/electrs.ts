import { IToken } from '@/interfaces/intefaces';
import { AddressUtxoDummy, ApiOrdUTXO, ApiUTXO, Fees, Inscription } from '../interfaces/api';
import { fetchBELLMainnet } from '../utils';
import { useCallback } from 'react';
import { useNintondoManagerContext } from '@/utils/bell-provider';

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

export const getDummyUTXOS = async (address: string, data: number[]) => {
  return await fetchBELLMainnet<AddressUtxoDummy[]>({
    path: `/address/${address}/utxo`,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const searchInscriptoins = async (address: string, txid: string) => {
  return await fetchBELLMainnet<ApiOrdUTXO[]>({
    path: `/address/${address}/ords?search=${txid}`,
  });
};

export const pushTx = async (txHex: string) => {
  return await fetchBELLMainnet<string>({
    path: '/tx',
    body: txHex,
    json: false,
    method: 'POST',
  });
};

export const getFees = async (): Promise<Fees> => {
  const data = (await fetchBELLMainnet({
    path: '/fee-estimates',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;
  return {
    slow: Number((data['6'] as number)?.toFixed(0)),
    fast: Number((data['2'] as number)?.toFixed(0)) + 1,
  };
};

export const useGetUserTokens = () => {
  const { address } = useNintondoManagerContext();

  return useCallback(async (): Promise<IToken[] | undefined> => {
    if (!address) return;
    return await fetchBELLMainnet<IToken[]>({
      path: `/address/${address}/tokens`,
    });
  }, [address]);
};
