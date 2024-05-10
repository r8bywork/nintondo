import { useCallback } from 'react';
import axios from 'axios';
import { fetchExplorer } from '../utils';
import {
  additionalFields,
  AddressStats,
  BlockData,
  BlockStatus,
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

export const useExplorerGetBlockById = () => {
  return useCallback(async (block: string): Promise<BlockData[] | undefined> => {
    return await fetchExplorer<BlockData[]>({
      path: `api/block/${block}`,
      json: true,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetTransactions = () => {
  return useCallback(async (block: string, length?: number): Promise<Transaction[] | undefined> => {
    return await fetchExplorer<Transaction[]>({
      path: `api/block/${block}/txs/${length || 0}`,
      json: true,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetBlockHeight = () => {
  return useCallback(async (): Promise<number | undefined> => {
    return await fetchExplorer<number>({
      path: 'api/blocks/tip/height',
      json: true,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetBlockStatus = () => {
  return useCallback(async (block: string): Promise<BlockStatus | undefined> => {
    return await fetchExplorer<BlockStatus>({
      path: `api/block/${block}/status`,
      json: true,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetTxOutspends = () => {
  return useCallback(async (txid: string): Promise<additionalFields[] | undefined> => {
    return await fetchExplorer<additionalFields[]>({
      path: `api/tx/${txid}/outspends`,
      json: true,
      method: 'GET',
    });
  }, []);
};
