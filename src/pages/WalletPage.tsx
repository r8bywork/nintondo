import { MARKET_API_URL } from '@/consts';
import { useMakeAuthRequests } from '@/hooks/auth';
import { useGetUserTokens } from '@/hooks/electrs';
import { useCreateListedSignedPSBT } from '@/hooks/market';
import { IToken, ITransfer } from '@/interfaces/intefaces';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import axios from 'axios';
import { useEffect, useState } from 'react';

const WalletPage = () => {
  const [userTokens, setUserTokens] = useState<IToken[]>([]);
  const getUserTokens = useGetUserTokens();
  const { verifiedAddress, inscribeTransfer } = useNintondoManagerContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_amouts, setAmounts] = useState<{ tick: string; amnt: number }[]>([]);

  const [price, setPrice] = useState<number>(0);

  const makeAuthRequest = useMakeAuthRequests();

  const createListedSignedPSBT = useCreateListedSignedPSBT();

  const inscribe = async (tick: string) => {
    const amount = await inscribeTransfer(tick);
    if (amount) setAmounts((prev) => [...prev, { amnt: amount, tick }]);
  };

  const listToken = async (transfer: ITransfer) => {
    const txid = transfer.inscription_id.slice(0, -2);
    const vout = Number(transfer.inscription_id.slice(-1));
    const psbt = await createListedSignedPSBT({ txid, vout }, price * transfer.amount);
    if (psbt) {
      const response = await makeAuthRequest(() =>
        axios.post(`${MARKET_API_URL}/list-token`, psbt, { withCredentials: true }),
      );
      console.log(response);
    }
  };

  useEffect(() => {
    getUserTokens().then((tokens) => {
      if (tokens) setUserTokens(tokens);
    });
  }, [getUserTokens]);

  if (!verifiedAddress)
    return (
      <div className={'bg-black'}>
        <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white'>
          Please connect your wallet
        </div>
      </div>
    );

  return (
    <div className='min-h-screen max-w-[1700px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white p-4'>
      <input
        type='number'
        className='text-black'
        placeholder='price'
        onChange={(e) => setPrice(Number(e.target.value))}
        value={price}
      />
      <div></div>
      {userTokens.map((f, i) => (
        <div
          key={i}
          className='flex flex-col'
        >
          <p>{f.tick}</p>
          <button
            onClick={() => {
              inscribe(f.tick);
            }}
          >
            Inscribe MORE TRANSFERs
          </button>
          <div>
            {f.transfers.map((transfer, transferId) => (
              <div
                key={transferId}
                className='flex w-full justify-between'
              >
                <p>{transfer.amount}</p>
                <button
                  onClick={() => {
                    listToken(transfer);
                  }}
                >
                  List
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletPage;
