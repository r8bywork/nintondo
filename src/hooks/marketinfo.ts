import { useCallback } from 'react';
import { fetchInscriptionOwner, fetchMarketInfo } from '../utils';
import { InscriptionCards, InscriptionInfo, InscriptionOwner } from '../interfaces/inscriptions.ts';

export const useExplorerGetInscriptionInfo = () => {
  return useCallback(async (hash: string): Promise<InscriptionInfo | undefined> => {
    return await fetchMarketInfo<InscriptionInfo>({
      path: `pub/${hash}/info`,
      json: true,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetInscriptionImage = () => {
  return useCallback(async (hash: string): Promise<Response | undefined> => {
    return await fetchMarketInfo<Response>({
      path: `pub/preview/${hash}`,
      json: false,
      method: 'GET',
    });
  }, []);
};

export const useExplorerGetInscriptionsList = () => {
  return useCallback(
    async (
      page?: number,
      sortBy?: string,
      contentFilter?: string,
      timeFilter?: string,
      from?: string,
      to?: string,
      genesisBlock?: number,
      tokens?: string,
      account?: string,
    ): Promise<InscriptionCards | undefined> => {
      const genesisBlockUrl = genesisBlock ? `&genesis_block=${genesisBlock}` : '';
      const accountUrl = account ? account != "all" && account != "any" ? `&account=${account}` : '' : '';
      const url = `pub/search?&page=${page}&sort_by=${sortBy}&content_filter=${contentFilter}&time_filter=${timeFilter}&tokens=${tokens}&from=${from}&to=${
        to === 'max' ? '18446744073709551615' : to
      }${genesisBlockUrl}${accountUrl}`;
      return await fetchMarketInfo<InscriptionCards>({
        path: url,
        json: true,
        method: 'GET',
      });
    },
    [],
  );
};

export const useExplorerGetInscriptionOwner = () => {
  return useCallback(async (hash: string): Promise<InscriptionOwner | undefined> => {
    return await fetchInscriptionOwner<InscriptionOwner>({
      path: `pub/${hash}/owner`,
      json: true,
      method: 'GET',
    });
  }, []);
};
