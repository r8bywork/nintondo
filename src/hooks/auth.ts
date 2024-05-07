import { BACKEND_URL } from '@/consts';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import axios, { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useMakeAuthRequests = () => {
  const { disconnect } = useNintondoManagerContext();
  return useCallback(
    async <T>(request: () => Promise<AxiosResponse<T>>) => {
      const fail = () => {
        disconnect();
        toast.error('Your login has expired, please connect your wallet again');
      };

      try {
        return await request();
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          try {
            await axios.get(`${BACKEND_URL}/auth/refresh`, { withCredentials: true });
            return await request();
          } catch (e) {
            fail();
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toast.error((e as any).response.data);
        }
      }
    },
    [disconnect],
  );
};
