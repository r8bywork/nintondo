import { useCallback } from 'react';
import { fetchMarketInfo } from '../utils';
import { InscriptionCards, InscriptionInfo } from '../interfaces/inscriptions.ts';

export const useExplorerGetInscriptionInfo = () => {
  return useCallback(async (hash: string): Promise<InscriptionInfo | undefined> => {
    return await fetchMarketInfo<InscriptionInfo>({
      path: `pub/inscription_info/${hash}`,
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
    ): Promise<InscriptionCards | undefined> => {
      const url = `pub/search?&page=${page}&sort_by=${sortBy}&content_filter=${contentFilter}`;
      return await fetchMarketInfo<InscriptionCards>({
        path: url,
        json: true,
        method: 'GET',
      });
    },
    [],
  );
};
