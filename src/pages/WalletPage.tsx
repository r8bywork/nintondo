import { useGetUserTokens } from '@/hooks/electrs';
import { IToken } from '@/interfaces/intefaces';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import { useEffect, useState } from 'react';

const WalletPage = () => {
  const [userTokens, setUserTokens] = useState<IToken[]>([]);
  const getUserTokens = useGetUserTokens();
  const { verifiedAddress, inscribeTransfer } = useNintondoManagerContext();
  const [amouts, setAmounts] = useState<{ tick: string; amnt: number }[]>([]);

  const inscribe = async (tick: string) => {
    const amount = await inscribeTransfer(tick);
    if (amount) setAmounts((prev) => [...prev, { amnt: amount, tick }]);
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
      {userTokens.map((f, i) => (
        <div key={i}>
          <p>{f.tick}</p>
          <p>{f.balance}</p>
          {f.transfers.map((j, k) => (
            <div
              key={k}
              className='text-white'
            >
              {j.amount}
            </div>
          ))}
          <button
            className='cursor-pointer bg-[#FFFF] text-black p-2 rounded-lg font-bold'
            onClick={() => inscribe(f.tick)}
          >
            Inscribe transfer
          </button>
        </div>
      ))}

      {amouts.map((f, i) => (
        <div key={i}>
          {f.tick} - {f.amnt}
        </div>
      ))}
    </div>
  );
};

export default WalletPage;
