import { useCallback } from 'react';
import axios from 'axios';
import { fetchExplorer } from '../utils';
import {
  AddressStats,
  BlockData,
  MemPool,
  Transaction,
  TransactionData,
} from '../interfaces/intefaces.ts';

export const useExplorerTxInfo = () => {
  return useCallback(async (hash: string): Promise<Transaction[]> => {
    const memPool = await fetchExplorer<MemPool[]>({
      path: 'api/mempool',
      json: true,
      method: 'GET',
    });

    const feeEstimates = await fetchExplorer<number[]>({
      path: 'api/fee-estimates',
      json: true,
      method: 'GET',
    });

    const response = await axios.get(`https://api.nintondo.io/api/tx/${hash}`);
    return [{ ...response.data, ...memPool, fee: { ...feeEstimates } }];
  }, []);
};

export const useExplorerGetBlock = () => {
  return useCallback(async (hash: string): Promise<AddressStats | undefined> => {
    return await fetchExplorer<AddressStats>({
      path: `api/address/${hash}`,
      json: true,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetBlockTxs = () => {
  return useCallback(async (hash: string): Promise<Transaction[] | undefined> => {
    return await fetchExplorer<Transaction[]>({
      path: `api/address/${hash}/txs`,
      json: true,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetLatestTransactions = () => {
  return useCallback(async (): Promise<TransactionData[] | undefined> => {
    return await fetchExplorer<TransactionData[]>({
      path: 'api/mempool/recent',
      json: true,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetLatestBlock = () => {
  return useCallback(async (height?: number | null): Promise<BlockData[] | undefined> => {
    return await fetchExplorer<BlockData[]>({
      path: `api/blocks/${height ?? ''}`,
      json: true,
      method: 'GET',
    });
  }, []);
};
