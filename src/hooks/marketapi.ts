import { useCallback } from 'react';
import { IDummyInscription, IListInscriptions } from '../interfaces/marketapi';
import { fetchMarket } from '../utils';

export const useGetAvailableInscriptions = () => {
  return useCallback(async (): Promise<IDummyInscription[] | undefined> => {
    return await fetchMarket<IDummyInscription[]>({ path: '' });
  }, []);
};

export const useListInscription = () => {
  return useCallback(async (data: IListInscriptions): Promise<IDummyInscription | undefined> => {
    return await fetchMarket<IDummyInscription>({
      path: '/list-ord',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }, []);
};

export const useBuyInscription = () => {
  return useCallback(async (data: IListInscriptions): Promise<IDummyInscription | undefined> => {
    return await fetchMarket<IDummyInscription>({
      path: '/buy-ord',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }, []);
};
