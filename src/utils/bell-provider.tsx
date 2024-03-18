import { FC, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { INintondoManagerProvider } from '../interfaces/nintondo-manager-provider';
import toast from 'react-hot-toast';

const useNintondoManager = () => {
  const [nintondoExists, setExists] = useState<boolean | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [nintondo, setNintondo] = useState<any | undefined>(undefined);

  const connectWallet = useCallback(async () => {
    if (!nintondo) return;
    try {
      const receivedAddress = await nintondo.connect();
      setAddress(receivedAddress);
      return receivedAddress;
    } catch {
      toast.error('You rejected connection request');
    }
  }, [nintondo]);

  const signPsbtInputs = useCallback(
    async (
      psbtBase64: string,
      inputsToSign: number[],
      sigHashTypes?: number[][],
    ): Promise<string | undefined> => {
      if (!nintondo) return;
      try {
        const signedPsbt = await nintondo.signSpecificInputs(
          psbtBase64,
          inputsToSign,
          sigHashTypes,
        );
        return signedPsbt;
      } catch {
        toast.error('You rejected signing request');
      }
    },
    [nintondo],
  );

  const signTx = useCallback(async (): Promise<string | undefined> => {
    if (!nintondo) return;
  }, [nintondo]);

  const handleAccountsChanged = useCallback(() => {
    if (address) {
      setAddress(undefined);
    }
  }, [address]);

  useEffect(() => {
    let nintondo = (window as any).nintondo;
    if (nintondo === undefined) {
      setTimeout(() => {
        nintondo = (window as any).nintondo;
        setNintondo(nintondo);
        setExists(nintondo !== undefined);
      }, 1000);
    } else {
      setNintondo(nintondo);
      setExists(true);
    }
    if (nintondo !== undefined) nintondo.on('accountsChanged', handleAccountsChanged);
  }, [handleAccountsChanged]);

  return {
    nintondoExists,
    address,
    connectWallet,
    signTx,
    signPsbtInputs,
  };
};

const NintondoManagerContext = createContext<INintondoManagerProvider | undefined>(undefined);

// const nintondo = (window as any).nintondo;

const NintondoProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const nintondoManager = useNintondoManager();

  return (
    <NintondoManagerContext.Provider value={nintondoManager}>
      {children}
    </NintondoManagerContext.Provider>
  );
};

const useNintondoManagerContext = () => {
  const context = useContext(NintondoManagerContext);
  if (!context) {
    return {
      nintondoExists: false,
    } as INintondoManagerProvider;
  }
  return context;
};

export { NintondoProvider, useNintondoManagerContext };
