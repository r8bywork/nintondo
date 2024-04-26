import { useGetUserTokens } from '@/hooks/electrs';
import { IToken, ITransfer } from '@/interfaces/intefaces';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReloadSVG from '@/assets/reload.svg?react';
import PlusSVG from '@/assets/plus.svg?react';
import { useNintondoManagerContext } from '@/utils/bell-provider';

type SelectedTransfers = {
  transfers: ITransfer[];
  total: number;
};

export const List = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [userTokens, setUserTokens] = useState<IToken[]>([]);
  const [selectedTick, setSelectedTick] = useState<IToken | null>(null);
  const [selectedTransfers, setSelectedTransfers] = useState<SelectedTransfers>({
    transfers: [],
    total: 0,
  });
  const { inscribeTransfer } = useNintondoManagerContext();

  const tick = searchParams.get('tick') || '';

  const handleTickChange = (tick: IToken) => {
    searchParams.set('tick', tick.tick);
    setSelectedTransfers({ transfers: [], total: 0 });

    setSearchParams(searchParams);
  };

  const getUserTokens = useGetUserTokens();

  const updateUserTokens = () => {
    getUserTokens().then((tokens) => {
      if (tokens) setUserTokens(tokens);
    });
  };

  const handleTranferClick = (transfer: ITransfer, isRemove: boolean) => {
    if (isRemove) {
      setSelectedTransfers((selectedTransfers) => {
        return {
          transfers: selectedTransfers.transfers.filter(
            (st) => st.inscription_id !== transfer.inscription_id,
          ),
          total: selectedTransfers.total - transfer.amount,
        };
      });
    } else {
      setSelectedTransfers((selectedTransfers) => {
        return {
          transfers: [...selectedTransfers.transfers, transfer],
          total: selectedTransfers.total + transfer.amount,
        };
      });
    }
  };

  useEffect(() => {
    updateUserTokens();
  }, [getUserTokens]);

  useEffect(() => {
    const token = userTokens?.find((v) => v.tick === tick) || null;
    setSelectedTick(token);
  }, [userTokens, searchParams]);

  return (
    <div className='flex gap-[82px] max-[1200px]:flex-col'>
      <div className='flex flex-col gap-[40px] flex-shrink-0'>
        <div className='flex gap-[16px]'>
          <h1 className='text-[32px] leading-[34px] font-bold'>List for sale</h1>
          <button
            className='w-[33px] h-[33px] bg-white flex items-center justify-center rounded-[50%] mt-[3px]'
            onClick={updateUserTokens}
          >
            <ReloadSVG />
          </button>
        </div>
        <div className='flex flex-col gap-[41px]'>
          <div className='flex flex-col gap-[15px]'>
            {userTokens.map((token) => {
              const isSelected = token.tick === tick;

              return (
                <button
                  key={token.tick}
                  className={classNames(
                    'flex px-[20px] py-[9px] gap-[13px] bg-[#191919] rounded-[50px] items-center justify-between border transition',
                    isSelected ? 'border-[#FFBB00]' : 'border-[transparent]',
                  )}
                  onClick={() => handleTickChange(token)}
                >
                  <div className='flex items-center gap-[13px]'>
                    <div
                      className={classNames(
                        'h-[12px] w-[12px] rounded-[5px] border flex items-center justify-center transition flex-shrink-0',
                        isSelected ? 'border-[#FFBB00]' : 'border-white',
                      )}
                    >
                      <div
                        className={classNames(
                          'h-[6px] w-[6px] bg-[#FFBB00] rounded-[50%] transition',
                          isSelected ? 'scale-100' : 'scale-0',
                        )}
                      />
                    </div>
                    <p className='text-[20px] text-[#FFBB00] font-bold w-[120px] max-medium:w-[70px] text-left overflow-hidden text-ellipsis'>
                      {token.tick}
                    </p>
                  </div>
                  <p className='text-[20px] font-bold'>
                    {token.transferable_balance.toLocaleString()} / {token.balance.toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>
          <button className='font-bold py-[6px] rounded-[20px] text-[20px] text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)]'>
            LIST {selectedTransfers.total.toLocaleString()}
          </button>
        </div>
      </div>
      {selectedTick && (
        <div className='flex flex-col flex-1 gap-[40px]'>
          <h1 className='text-[32px] font-bold leading-[34px]'>
            List <span className='text-[#53DCFF]'>{selectedTick?.tick}</span>
          </h1>
          <div
            className='grid gap-[47px]'
            style={{
              gridTemplateColumns: 'repeat(auto-fill, 170px)',
            }}
          >
            {selectedTick.transfers.map((transfer) => {
              const transferAmountStr = transfer.amount.toLocaleString();
              const fontSize =
                transferAmountStr.length > 7 ? (32 * 5) / transferAmountStr.length : 32;

              const isSelected = selectedTransfers.transfers.some(
                (v) => v.inscription_id === transfer.inscription_id,
              );

              return (
                <button
                  key={transfer.inscription_id}
                  className={classNames(
                    'px-[10px] py-[13px] bg-[#191919] rounded-[15px] border flex flex-col gap-[15px] w-[170px] h-[130px]',
                    isSelected ? 'border-[#FFBB00]' : 'border-[transparent]',
                  )}
                  onClick={() => handleTranferClick(transfer, isSelected)}
                >
                  <div className='w-[150px] h-[70px] flex items-center justify-center rounded-[9px] bg-[#0F0F0F]'>
                    <div>
                      <p
                        className='font-bold'
                        style={{ fontSize }}
                      >
                        {transfer.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <p className='overflow-hidden rounded-[4px] text-ellipsis text-[16px] border border-[#FFBB00] text-[#FFBB00] px-[5px]'>
                      {selectedTick.tick}
                    </p>
                    <p className='rounded-[4px] text-[16px] border px-[5px]'>#{transfer.number}</p>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => inscribeTransfer(selectedTick.tick)}
              className='py-[20px] flex flex-col rounded-[15px] bg-[#191919] w-[170px] items-center justify-center gap-[13px] h-[130px]'
            >
              <PlusSVG />
              <p className='text-[20px] text-[#4B4B4B]'>
                Inscribe
                <br /> TRANSFER
              </p>
            </button>
          </div>
          <div className='flex flex-col gap-[17px]'>
            <div className='flex gap-[15px] flex-wrap'>
              <div className='flex items-center flex-shrink-1 px-[28px] py-[9px] rounded-[50px] gap-[100px] bg-[#191919] max-[1200px]:flex-1 max-[1200px]:justify-between'>
                <p className='text-[20px] text-[#4B4B4B] leading-[21px]'>TRANSFERABLE</p>
                <p className='text-[20px] font-bold flex-shrink-0'>
                  {selectedTick?.transferable_balance.toLocaleString()}
                  <span className='text-[16px] text-[#4b4b4b] font-normal'>
                    {' '}
                    {selectedTick.tick}
                  </span>
                </p>
              </div>
              <div className='flex items-center flex-shrink-1 px-[28px] py-[9px] rounded-[50px] gap-[100px] bg-[#191919] max-medium:flex-1 max-medium:justify-between'>
                <p className='text-[20px] text-[#4B4B4B] leading-[21px]'>AVAILABLE</p>
                <p className='text-[20px] font-bold flex-shrink-0'>
                  {selectedTick?.balance.toLocaleString()}
                  <span className='text-[16px] text-[#4b4b4b] font-normal'>
                    {' '}
                    {selectedTick.tick}
                  </span>
                </p>
              </div>
            </div>
            <p className='text-[16px] text-[#4B4B4B]'>
              The total value is limited to between 50000 sats (0.0005 BTC) and 20000000 sats (0.2
              BTC).
            </p>
          </div>
          <div className='flex justify-center'>
            <button className='max-[1200px]:flex-1 font-bold py-[6px] px-[101px] rounded-[20px] text-[20px] text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)]'>
              LIST {selectedTransfers.total.toLocaleString()} {selectedTick.tick}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
