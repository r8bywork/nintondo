import { useGetUserTokens } from '@/hooks/electrs';
import { IToken, ITransfer } from '@/interfaces/intefaces';
import classNames from 'classnames';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReloadSVG from '@/assets/reload.svg?react';
import PlusSVG from '@/assets/plus.svg?react';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../Modal';
import { useMakeAuthRequests } from '@/hooks/auth';
import { MARKET_API_URL } from '@/consts';
import { useCreateListedSignedPSBT } from '@/hooks/market';
import axios from 'axios';
import { Listed } from '@/interfaces/api';

type SelectedTransfers = {
  transfers: ITransfer[];
  total: number;
};

type ListProps = {
  isListed?: boolean;
};

const filterListed = (token: IToken, listed: Listed, reverse: boolean): IToken => {
  return {
    ...token,
    transfers: token.transfers.filter((tranfer) =>
      reverse
        ? listed?.token_numbers.includes(tranfer.number)
        : !listed?.token_numbers.includes(tranfer.number),
    ),
  };
};

export const List = ({ isListed = false }: ListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [userTokens, setUserTokens] = useState<IToken[]>([]);
  const [userTokensRaw, setUserTokensRaw] = useState<IToken[]>([]);
  const [selectedTick, setSelectedTick] = useState<IToken | null>(null);
  const [selectedTransfers, setSelectedTransfers] = useState<SelectedTransfers>({
    transfers: [],
    total: 0,
  });
  const { open, close, isOpen } = useModal();
  const { inscribeTransfer, getPublicKey } = useNintondoManagerContext();
  const makeAuthRequest = useMakeAuthRequests();
  const createSignedListPsbt = useCreateListedSignedPSBT();

  const [price, setPrice] = useState<number>(0.2);
  const tick = searchParams.get('tick') || '';

  const buttonText = useMemo(() => {
    return isListed ? 'ULIST' : 'LIST';
  }, [isListed]);

  const handleTickChange = (tick: IToken) => {
    searchParams.set('tick', tick.tick);
    setSelectedTransfers({ transfers: [], total: 0 });

    setSearchParams(searchParams);
  };

  const getUserTokens = useGetUserTokens();

  const handleClose = () => {
    setPrice(0);
    close();
  };

  const updateUserTokens = useCallback(async () => {
    const userTokensPromise = getUserTokens();

    const listedPromise = makeAuthRequest(() =>
      axios.get(`${MARKET_API_URL}/tokens/listed`, { withCredentials: true }),
    );

    const [userTokens, listed] = await Promise.all([userTokensPromise, listedPromise]);

    if (!userTokens) return;

    if (userTokens && listed) {
      setUserTokensRaw(userTokens);
      setUserTokens(
        userTokens.map((token) => {
          const tickListed = (listed.data as Listed[]).find((v) => v.tick === token.tick)!;
          return filterListed(token, tickListed, isListed);
        }),
      );
    }
  }, [getUserTokens, isListed]);

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

  const updateUserTokensForTick = async () => {
    const listed = await makeAuthRequest(() =>
      axios.get(`${MARKET_API_URL}/tokens/listed/${selectedTick?.tick}`, { withCredentials: true }),
    );

    if (!listed) return;

    setUserTokens(
      userTokensRaw.map((token) => {
        return filterListed(token, listed.data as Listed, isListed);
      }),
    );
  };

  const list = async () => {
    const txid = selectedTransfers.transfers[0].inscription_id.slice(0, -2);
    const vout = selectedTransfers.transfers[0].inscription_id.slice(-1);
    // eslint-disable-next-line camelcase
    const public_key_hex = await getPublicKey();
    const psbt = await createSignedListPsbt(
      {
        txid,
        vout: Number(vout),
      },
      price,
    );
    const response = await makeAuthRequest(() =>
      axios.post(
        `${MARKET_API_URL}/tokens/list-token`,
        // eslint-disable-next-line camelcase
        { psbt_base64: psbt, public_key_hex },
        { withCredentials: true },
      ),
    );
    console.log(response);
    await updateUserTokensForTick();
    setSelectedTransfers({ transfers: [], total: 0 });
    close();
  };

  const unlist = async () => {
    await makeAuthRequest(() =>
      axios.delete(`${MARKET_API_URL}/tokens/listed`, {
        withCredentials: true,
        data: { numbers: selectedTransfers.transfers.map((v) => v.number) },
      }),
    );

    await updateUserTokensForTick();
    setSelectedTransfers({ transfers: [], total: 0 });
    close();
  };

  const handleOpenModal = () => {
    if (selectedTransfers.transfers.length > 0) open();
  };

  useEffect(() => {
    updateUserTokens();
  }, [isListed, getUserTokens]);

  useEffect(() => {
    const token = userTokens?.find((v) => v.tick === tick) || userTokens[0];
    setSelectedTick(token);
  }, [userTokens, searchParams]);

  useEffect(() => {
    return () => {
      setSelectedTransfers({
        transfers: [],
        total: 0,
      });
    };
  }, [searchParams]);

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
              const isSelected = token.tick === selectedTick?.tick;

              return (
                <button
                  key={token.tick}
                  className={classNames(
                    'flex px-[20px] py-[9px] gap-[13px] bg-[#191919] rounded-[50px] items-center justify-between border transition duration-300',
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
          <button
            onClick={open}
            className='font-bold py-[6px] rounded-[20px] text-[20px] text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)] disabled:opacity-50'
            disabled={selectedTransfers.transfers.length === 0}
          >
            {isListed ? 'ULIST' : 'LIST'} {selectedTransfers.total.toLocaleString()}
          </button>
        </div>
      </div>
      {selectedTick && (
        <div className='flex flex-col flex-1 gap-[40px]'>
          <h1 className='text-[32px] font-bold leading-[34px]'>
            List <span className='text-[#53DCFF]'>{selectedTick?.tick}</span>
          </h1>
          {isListed || (
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
          )}

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
                    'px-[10px] py-[13px] bg-[#191919] rounded-[15px] border flex flex-col gap-[15px] w-[170px] h-[130px] transition',
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
                  <div className='flex justify-between flex-1'>
                    <p className='overflow-hidden rounded-[4px] text-ellipsis text-[16px] border border-[#FFBB00] text-[#FFBB00] px-[5px]'>
                      {selectedTick.tick}
                    </p>
                    <p className='rounded-[4px] text-[16px] border px-[5px]'>#{transfer.number}</p>
                  </div>
                </button>
              );
            })}
            {isListed || (
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
            )}
          </div>
        </div>
      )}
      {isOpen && (
        <Modal
          isOpen
          onClose={handleClose}
        >
          <div className='rounded-[15px] px-[62px] py-[21px] bg-[#191919] p-[25px]'>
            {isListed ? (
              <div className='flex flex-col gap-[34px] items-center'>
                <h1 className='text-[20px] leading-[21px] font-bold'>Confirmation</h1>
                <p className='text-[20px] leading-[21px] text-[#53DCFF]'>
                  Unlist following tokens?
                </p>
                <div
                  className={classNames(
                    'flex gap-[34px] max-w-[500px] overflow-auto',
                    selectedTransfers.transfers.length > 2 && 'px-[62px] -mx-[62px]',
                  )}
                >
                  {selectedTransfers.transfers.map((transfer) => {
                    const transferAmountStr = transfer.amount.toLocaleString();
                    const fontSize =
                      transferAmountStr.length > 7 ? (32 * 5) / transferAmountStr.length : 32;
                    return (
                      <div
                        key={transfer.inscription_id}
                        className={classNames(
                          'px-[10px] py-[13px] bg-[#262626] rounded-[15px] flex flex-col gap-[15px] w-[170px] h-[130px] transition',
                        )}
                      >
                        <div className='w-[150px] h-[70px] flex items-center justify-center rounded-[9px] bg-[#0F0F0F]'>
                          <div>
                            <p
                              style={{
                                fontSize,
                              }}
                              className='font-bold'
                            >
                              {transfer.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className='flex justify-between flex-1'>
                          <p className='overflow-hidden rounded-[4px] text-ellipsis text-[16px] border border-[#FFBB00] text-[#FFBB00] px-[5px]'>
                            {selectedTick!.tick}
                          </p>
                          <p className='rounded-[4px] text-[16px] border px-[5px]'>
                            #{transfer.number}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='flex px-[24px] py-[9px] justify-between w-full border border-[#53DCFF] rounded-[50px]'>
                  <p className='text-[20px] font-bold leading-[21px] text-[#53DCFF]'>TOTAL</p>
                  <p className='text-[20px] font-bold leading-[21px]'>
                    {selectedTransfers.total.toLocaleString()}
                  </p>
                </div>
                <div className='flex gap-[52px]'>
                  <button
                    onClick={close}
                    className='font-bold py-[6px] px-[45px] rounded-[20px] text-[20px] text-black bg-white'
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={unlist}
                    className='font-bold py-[6px] px-[45px] rounded-[20px] text-[20px] text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)]'
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-[15px]'>
                <input
                  inputMode='numeric'
                  pattern='[0-9]*'
                  className='rounded-[50px] outline-none px-[10px] py-[3px] text-[20px] bg-[#4b4b4b]'
                  value={price}
                  onChange={(e) =>
                    setPrice((price) =>
                      isNaN(Number(e.target.value)) ? price : Number(e.target.value),
                    )
                  }
                />
                <button
                  onClick={list}
                  className='max-[1200px]:flex-1 font-bold py-[6px] px-[101px] rounded-[20px] text-[20px] text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)]'
                >
                  UNLIST {selectedTransfers.total.toLocaleString()} {selectedTick?.tick}
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
      <div className='fixed flex justify-center items-center w-screen bottom-0 left-0 h-[113px] mobile:h-[72px] backdrop-blur-sm border-t-[1px] border-[#191919]'>
        <div className='max-w-[1390px] flex items-center justify-between px-5 w-full max-medium:flex-col'>
          <div className='items-center flex gap-2 font-bold text-[16px] border-[1px] border-white rounded-[30px] h-[24px] w-[336px] justify-center px-[15px]'>
            <input
              type='range'
              className='styled-range'
              max={selectedTick?.transfers.length}
              min={0}
              value={selectedTransfers.transfers.length}
            />
            <span className='w-[16px]'>{selectedTransfers.transfers.length}</span>
          </div>
          <div className='flex gap-[18px]'>
            {isListed || (
              <button
                className={classNames(
                  'px-[31px] py-[6px] border font-bold text-[20px] leading-[21px] transition rounded-[50px]',
                  selectedTransfers.transfers.length > 0
                    ? 'border-[#53DCFF] text-[#53DCFF]'
                    : 'border-[#262626] text-[#262626]',
                )}
                disabled={!selectedTransfers.transfers.length}
              >
                DELETE SELECTED ({selectedTick?.tick})
              </button>
            )}
            <button
              className={classNames(
                'px-[31px] py-[6px] border font-bold text-[20px] leading-[21px] transition rounded-[50px]',
                selectedTransfers.transfers.length > 0
                  ? 'border-[#FFBB00] text-[#FFBB00]'
                  : 'border-[#262626] text-[#262626] cursor-default',
              )}
              onClick={handleOpenModal}
            >
              {buttonText} SELETED ({selectedTransfers.total.toLocaleString()} {selectedTick?.tick})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
