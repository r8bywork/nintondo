import { FC, createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ECPairFactory from 'belpair';
import * as tinysecp from 'bells-secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { AddressType, getAddress } from '.';
import { INintondoManagerProvider, SignPsbtOptions } from '@/interfaces/nintondo-manager-provider';

const ECPair = ECPairFactory(tinysecp);
const useNintondoManager = () => {
  const [nintondoExists, setExists] = useState<boolean | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nintondo, setNintondo] = useState<any | undefined>(undefined);
  const [verifiedAddress, setVerifiedAddress] = useState<boolean>(false);

  const getPublicKey = useCallback(async () => {
    if (!nintondo) return;
    return await nintondo.getPublicKey();
  }, [nintondo]);

  const connectWallet = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (wallet?: any) => {
      if (!nintondo && !wallet) return;
      try {
        const receivedAddress = await (nintondo ?? wallet).connect();
        setAddress(receivedAddress);
        return receivedAddress;
      } catch {
        toast.error('You rejected connection request');
      }
    },
    [nintondo],
  );

  const signPsbtInputs = useCallback(
    async (psbtBase64: string, options?: SignPsbtOptions): Promise<string | undefined> => {
      if (!nintondo) return;
      try {
        const signedPsbt = await nintondo.signPsbt(psbtBase64, options);
        return signedPsbt;
      } catch {
        toast.error('You rejected signing request');
      }
    },
    [nintondo],
  );

  const verifyAddress = useCallback(async () => {
    if (!nintondo) return;
    await connectWallet();
    if (await checkStorage()) return;
    const connectedAddress = address ?? (await connectWallet());
    const message = `
Welcome to Nintondo!

If you sign you agree to our policy.
      
This request will not trigger a blockchain transaction.
      
Your authentication status will reset after 24 hours.
      
Wallet address:
${connectedAddress}
    `;

    try {
      const signedMessage = await nintondo.signMessage(message);
      const signatureBuffer = Buffer.from(signedMessage, 'base64');
      const publicKeyBuffer = Buffer.from(await nintondo.getPublicKey(), 'hex');
      const pair = ECPair.fromPublicKey(publicKeyBuffer);
      const verified = pair.verify(Buffer.from(sha256(message)), signatureBuffer);
      if (verified) {
        const publicAddress = getAddress(publicKeyBuffer, AddressType.P2PKH);
        if (publicAddress === connectedAddress) {
          setVerifiedAddress(true);
          localStorage.setItem('verifiedAddress', connectedAddress);
        } else toast.error('Failed to verify address');
      } else toast.error('Failed to verify address');
    } catch (e) {
      console.log(e);
      toast.error('Failed to verify address');
    }
  }, [address, nintondo]);

  const signTx = useCallback(async (): Promise<string | undefined> => {
    if (!nintondo) return;
  }, [nintondo]);

  const handleAccountsChanged = useCallback(async () => {
    if (address) {
      setAddress(undefined);
      setVerifiedAddress(false);
      await checkStorage();
    }
  }, [address]);

  const checkStorage = useCallback(async () => {
    if (!nintondo) return;
    const verifiedAddress = localStorage.getItem('verifiedAddress');
    if (verifiedAddress !== null) {
      const publicKeyHex = await nintondo.getPublicKey();
      if (!publicKeyHex) return;
      const publicKeyBuffer = Buffer.from(await nintondo.getPublicKey(), 'hex');
      if (verifiedAddress === getAddress(publicKeyBuffer, AddressType.P2PKH)) {
        setVerifiedAddress(true);
        setAddress(verifiedAddress);
        return true;
      }
    }
  }, [nintondo]);

  const disconnect = async () => {
    setAddress(undefined);
    setVerifiedAddress(false);
    localStorage.removeItem('verifiedAddress');
  };

  useEffect(() => {
    (async () => {
      await checkStorage();
    })();
  }, [checkStorage, nintondo]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nintondo = (window as any).nintondo;
    if (nintondo === undefined) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    verifyAddress,
    verifiedAddress,
    getPublicKey,
    disconnect,
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
