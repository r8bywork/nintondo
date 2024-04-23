import { useCallback } from 'react';
import { fetchInscriptionOwner, fetchContent, fetchMarket } from '../utils';
import { InscriptionCards, InscriptionInfo, InscriptionOwner } from '../interfaces/inscriptions.ts';
import { ListedTokenCard } from '@/interfaces/marketapi.ts';

export const useExplorerGetInscriptionInfo = () => {
  return useCallback(async (hash: string): Promise<InscriptionInfo | undefined> => {
    return await fetchContent<InscriptionInfo>({
      path: `pub/${hash}/info`,
    });
  }, []);
};

export const useExplorerGetInscriptionImage = () => {
  return useCallback(async (hash: string): Promise<Response | undefined> => {
    return await fetchContent<Response>({
      path: `pub/preview/${hash}`,
      json: false,
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
    ): Promise<InscriptionCards | undefined> => {
      const genesisBlockUrl = genesisBlock ? `&genesis_block=${genesisBlock}` : '';
      const url = `pub/search?&page=${page}&sort_by=${sortBy}&content_filter=${contentFilter}&time_filter=${timeFilter}&from=${from}&to=${
        to === 'max' ? '18446744073709551615' : to
      }${genesisBlockUrl}`;
      return await fetchContent<InscriptionCards>({
        path: url,
      });
    },
    [],
  );
};

export const useExplorerGetInscriptionOwner = () => {
  return useCallback(async (hash: string): Promise<InscriptionOwner | undefined> => {
    return await fetchInscriptionOwner<InscriptionOwner>({
      path: `pub/${hash}/owner`,
    });
  }, []);
};

export const useGetListedTokens = () => {
  return useCallback(async (page: number, tick: string, filter: string) => {
    const path = `pub/tokens?&page=${page}&tick=${tick}&filter=${filter}`;
    return await fetchMarket<ListedTokenCard>({ path });
  }, []);
};
