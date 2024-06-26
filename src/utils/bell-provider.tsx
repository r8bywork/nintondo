import { FC, createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ECPairFactory from 'belpair';
import * as tinysecp from 'bells-secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { AddressType, getAddress } from '.';
import {
  Claims,
  INintondoManagerProvider,
  SignPsbtData,
  SignPsbtOptions,
} from '@/interfaces/nintondo-manager-provider';
import axios from 'axios';
import { BACKEND_URL, DOMAIN } from '@/consts';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

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
      if (!nintondo && !wallet) {
        toast.error('Please install Nintondo wallet first');
        return;
      }
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

  const getBalance = useCallback(async () => {
    if (!verifiedAddress) return;
    return await nintondo.getBalance();
  }, [verifiedAddress]);

  const verifyAddress = useCallback(async () => {
    if (!nintondo) return;
    const connectedAddress = address ?? (await connectWallet());
    if (!connectedAddress) return;

    try {
      const message = (await axios.get(`${BACKEND_URL}/auth/nonce/${connectedAddress}`)).data;
      const signedMessage = await nintondo.signMessage(message);
      const signatureBufferBase64 = Buffer.from(signedMessage, 'base64');
      const signatureBufferHex = Buffer.from(signedMessage, 'hex');
      const publicKeyBuffer = Buffer.from(await nintondo.getPublicKey(), 'hex');
      const pair = ECPair.fromPublicKey(publicKeyBuffer);
      let verified;
      try {
        verified = pair.verify(Buffer.from(sha256(message)), signatureBufferBase64);
      } catch (e) {
        verified = pair.verify(Buffer.from(sha256(message)), signatureBufferHex);
      }
      if (verified) {
        const publicAddress = getAddress(publicKeyBuffer, AddressType.P2PKH);
        if (publicAddress === connectedAddress) {
          await axios.post(
            `${BACKEND_URL}/auth/login`,
            {
              address: connectedAddress,
              // eslint-disable-next-line camelcase
              signed_message_string: signedMessage,
              // eslint-disable-next-line camelcase
              public_key_hex: await nintondo.getPublicKey(),
            },
            { withCredentials: true },
          );

          const accessToken = Cookies.get('access_token');
          if (accessToken) setVerifiedAddress(true);

          // localStorage.setItem('verifiedAddress', connectedAddress);
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
      await checkCookies();
    }
  }, [address]);

  const signMultiPsbt = async (data: SignPsbtData[]) => {
    if (!nintondo) return;
    try {
      const result = await nintondo.multiPsbtSign(data);
      return result as string[];
    } catch {
      toast.error('You rejected signing request');
    }
  };

  const checkCookies = useCallback(async () => {
    if (!nintondo) return;
    const token = Cookies.get('access_token');
    if (!token) return;
    const verifiedAddress = jwtDecode<Claims>(token).address;

    if (verifiedAddress !== null) {
      const publicKeyHex = await nintondo.getPublicKey();
      if (!publicKeyHex) {
        await connectWallet();
        return;
      }
      const publicKeyBuffer = Buffer.from(await nintondo.getPublicKey(), 'hex');
      if (verifiedAddress === getAddress(publicKeyBuffer, AddressType.P2PKH)) {
        setVerifiedAddress(true);
        setAddress(verifiedAddress);
        return true;
      }
    }
  }, [nintondo]);

  const inscribeTransfer = async (tick: string) => {
    if (!nintondo) return;
    return (await nintondo.inscribeTransfer(tick)).mintedAmount;
  };

  const disconnect = async () => {
    Cookies.remove('access_token', {
      path: '/',
      domain: DOMAIN.includes(':') ? DOMAIN.slice(0, 9) : DOMAIN,
    });
    Cookies.remove('refresh_token', { path: '/', domain: DOMAIN });
    setAddress(undefined);
    setVerifiedAddress(false);
  };

  useEffect(() => {
    (async () => {
      await checkCookies();
    })();
  }, [checkCookies, nintondo]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nintondo = (window as any).nintondo;
    if (nintondo === undefined) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nintondo = (window as any).nintondo;
        setNintondo(nintondo);
        setExists(nintondo !== undefined);
      }, 500);
    } else {
      setNintondo(nintondo);
      setExists(true);
    }
    if (nintondo !== undefined) nintondo.on('accountsChanged', handleAccountsChanged);
  }, [handleAccountsChanged, nintondo]);

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
    inscribeTransfer,
    signMultiPsbt,
    getBalance,
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
