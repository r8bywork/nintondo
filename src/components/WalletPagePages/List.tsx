/* eslint-disable camelcase */
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
import { omit } from 'lodash';
import { Unlist } from './components/Unlist';
import { BottomSelect } from '../BottomSelect/BottomSelect';
import { ListModal } from './components/ListModal';

type SelectedTransfers = {
  transfers: Record<string, ITransfer[]>;
  total: number;
};

type ListProps = {
  isListed?: boolean;
};

const defaultSelectedTransfers: SelectedTransfers = {
  transfers: {},
  total: 0,
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

// TODO: refactor this code
export const List = ({ isListed = false }: ListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [userTokens, setUserTokens] = useState<IToken[]>([]);
  const [userTokensRaw, setUserTokensRaw] = useState<IToken[]>([]);
  const [selectedTick, setSelectedTick] = useState<IToken | null>(null);
  const [selectedTransfers, setSelectedTransfers] =
    useState<SelectedTransfers>(defaultSelectedTransfers);
  // there are two buttons in the page to open modal with defferent data
  // so we need to add them to state of modal data ad first
  const [toModal, setToModal] = useState<SelectedTransfers>(defaultSelectedTransfers);
  const { open, close, isOpen } = useModal();
  const { inscribeTransfer, getPublicKey } = useNintondoManagerContext();
  const makeAuthRequest = useMakeAuthRequests();
  const createSignedListPsbt = useCreateListedSignedPSBT();

  // const [price, setPrice] = useState<number>(0.2);
  const tick = searchParams.get('tick') || selectedTick?.tick;

  const buttonText = useMemo(() => {
    return isListed ? 'UNLIST' : 'LIST';
  }, [isListed]);

  const selectedTransfersByTick = useMemo(() => {
    const transfers: ITransfer[] = selectedTransfers.transfers[selectedTick?.tick || ''] || [];

    return {
      amount: transfers.reduce((acc, transfer) => acc + transfer.amount, 0),
      transfers: transfers,
    };
  }, [selectedTick, selectedTransfers]);

  const handleTickChange = (tick: IToken) => {
    searchParams.set('tick', tick.tick);

    setSearchParams(searchParams);
  };

  const getUserTokens = useGetUserTokens();

  const handleClose = () => {
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
      setSelectedTransfers((selectedTransfers) => ({
        transfers: {
          ...selectedTransfers.transfers,
          [selectedTick!.tick]: selectedTransfersByTick.transfers.filter(
            (v) => v.number !== transfer.number,
          ),
        },
        total: selectedTransfers.total - transfer.amount,
      }));

      return;
    }

    setSelectedTransfers((selectedTransfers) => ({
      transfers: {
        ...selectedTransfers.transfers,
        [selectedTick!.tick]: [...selectedTransfersByTick.transfers, transfer],
      },
      total: transfer.amount + selectedTransfers.total,
    }));
  };

  const handleTranferRangeChange = (value: number) => {
    const transfers = selectedTick!.transfers.slice(0, value);

    const amount = transfers?.reduce((acc, v) => acc + v.amount, 0);

    setSelectedTransfers((selectedTransfers) => ({
      transfers: {
        ...selectedTransfers.transfers,
        [selectedTick!.tick]: transfers,
      },

      total:
        Object.values(
          omit(selectedTransfers.transfers, selectedTick!.tick) as SelectedTransfers['transfers'],
        ).reduce((acc, v) => acc + v.reduce((acc, r) => acc + r.amount, 0), 0) + amount,
    }));
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

  const list = async (price: number) => {
    if (selectedTransfers.total < 1) return;
    const public_key_hex = await getPublicKey();
    const psbts_base64 = await createSignedListPsbt(
      Object.values(selectedTransfers.transfers).flatMap((r) =>
        r.flatMap((f) => ({
          txid: f.inscription_id.slice(0, -2),
          vout: Number(f.inscription_id.slice(-1)),
          price: f.amount * price,
        })),
      ),
    );
    await makeAuthRequest(() =>
      axios.post(
        `${MARKET_API_URL}/tokens/list-tokens`,
        // eslint-disable-next-line camelcase
        { psbts_base64, public_key_hex },
        { withCredentials: true },
      ),
    );

    await updateUserTokensForTick();
    setSelectedTransfers(defaultSelectedTransfers);
    close();
  };

  const unlist = async (transfers: SelectedTransfers['transfers']) => {
    await makeAuthRequest(() =>
      axios.delete(`${MARKET_API_URL}/tokens/listed`, {
        withCredentials: true,
        data: {
          numbers: Object.values(transfers).reduce(
            (acc, item) => [...acc, ...item.map((v) => v.number)],
            [] as number[],
          ),
        },
      }),
    );

    await updateUserTokensForTick();
    setSelectedTransfers(defaultSelectedTransfers);
    close();
  };

  const handleListAllClick = () => {
    setToModal(selectedTransfers);
    open();
  };

  const handleListByTickClick = () => {
    setToModal({
      transfers: {
        [selectedTick!.tick]: selectedTransfersByTick.transfers,
      },
      total: selectedTransfersByTick.amount,
    });
    open();
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
      setSelectedTransfers(defaultSelectedTransfers);
    };
  }, [isListed]);

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
            onClick={handleListAllClick}
            className='font-bold py-[6px] rounded-[20px] text-[20px] transition duration-300 text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)] disabled:opacity-50'
            disabled={selectedTransfers.total === 0}
          >
            {buttonText} {selectedTransfers.total.toLocaleString()}
          </button>
        </div>
      </div>
      {selectedTick && (
        <div className='flex flex-col flex-1 gap-[40px]'>
          <div className='flex items-center gap-[24px]'>
            <h1 className='text-[32px] font-bold leading-[34px]'>
              {isListed ? 'Unlist' : 'List'} <span className='text-[#53DCFF]'>{selectedTick?.tick}</span>
            </h1>
            {isListed || (
              <button
                className={
                  'px-[17px] py-[2px] border font-bold text-[20px] flex items-center gap-[10px] leading-[21px] transition rounded-[50px] border-[#53DCFF] text-[#53DCFF]'
                }
                onClick={() => inscribeTransfer(selectedTick.tick)}
              >
                <PlusSVG />
                INSCRIBE TRANSFER
              </button>
            )}
          </div>
          {isListed || (
            <div className='flex flex-col gap-[17px]'>
              <div className='flex gap-[15px] flex-wrap'>
                <div className='flex items-center flex-1 px-[28px] justify-between py-[9px] rounded-[50px] gap-[100px] bg-[#191919] max-[1200px]:flex-1 max-[1200px]:justify-between'>
                  <p className='text-[20px] text-[#4B4B4B] leading-[21px]'>TRANSFERABLE</p>
                  <div className='text-[20px] font-bold flex gap-[10px]'>
                    {selectedTick?.transferable_balance.toLocaleString()}
                    <div className='text-[16px] text-[#4b4b4b] font-normal pt-[5px]'>
                      {' '}
                      {selectedTick.tick}
                    </div>
                  </div>
                </div>
                <div className='flex items-center flex-1  justify-between px-[28px] py-[9px] rounded-[50px] gap-[100px] bg-[#191919] max-medium:flex-1 max-medium:justify-between'>
                  <p className='text-[20px] text-[#4B4B4B] leading-[21px]'>AVAILABLE</p>
                  <div className='text-[20px] font-bold flex gap-[10px]'>
                    {selectedTick?.balance.toLocaleString()}
                    <div className='text-[16px] text-[#4b4b4b] font-normal pt-[5px]'>
                      {' '}
                      {selectedTick.tick}
                    </div>
                  </div>
                </div>
              </div>
              {/* <p className='text-[16px] text-[#4B4B4B]'>
                The total value is limited to between 50000 sats (0.0005 BTC) and 20000000 sats (0.2
                BTC).
              </p> */}
            </div>
          )}

          <div
            className='grid gap-[47px] pb-[100px]'
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            }}
          >
            {selectedTick.transfers.map((transfer) => {
              const transferAmountStr = transfer.amount.toLocaleString();
              const fontSize =
                transferAmountStr.length > 7 ? (32 * 5) / transferAmountStr.length : 32;

              const isSelected = selectedTransfersByTick.transfers.some(
                (v) => v.inscription_id === transfer.inscription_id,
              );

              return (
                <button
                  key={transfer.inscription_id}
                  className={classNames(
                    'px-[10px] py-[13px] bg-[#191919] rounded-[15px] border flex flex-col gap-[15px] w-full min-w-[170px] h-[130px] transition',
                    isSelected ? 'border-[#FFBB00]' : 'border-[transparent]',
                  )}
                  onClick={() => handleTranferClick(transfer, isSelected)}
                >
                  <div className='w-full h-[70px] flex items-center justify-center rounded-[9px] bg-[#0F0F0F]'>
                    <div>
                      <p
                        className='font-bold'
                        style={{ fontSize }}
                      >
                        {transfer.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between flex-1 w-full'>
                    <p className='overflow-hidden rounded-[4px] text-ellipsis text-[16px] border border-[#FFBB00] text-[#FFBB00] px-[5px]'>
                      {selectedTick.tick}
                    </p>
                    <p className='rounded-[4px] text-[16px] border px-[5px]'>#{transfer.number}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
      >
        <div className='rounded-[15px] px-[62px] py-[21px] bg-[#191919] p-[25px]'>
          {isListed ? (
            <Unlist
              onCancel={handleClose}
              transfers={toModal.transfers}
              amount={toModal.total}
              unlist={unlist}
            />
          ) : (
            // <div className='flex flex-col gap-[15px]'>
            //   <input
            //     inputMode='numeric'
            //     pattern='[0-9]*'
            //     className='rounded-[50px] outline-none px-[10px] py-[3px] text-[20px] bg-[#4b4b4b]'
            //     value={price}
            //     onChange={(e) =>
            //       setPrice((price) =>
            //         isNaN(Number(e.target.value)) ? price : Number(e.target.value),
            //       )
            //     }
            //   />
            //   <button
            //     onClick={list}
            //     className='max-[1200px]:flex-1 font-bold py-[6px] px-[101px] rounded-[20px] text-[20px] text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)]'
            //   >
            //     LIST {selectedTransfers.total.toLocaleString()} {selectedTick?.tick}
            //   </button>
            // </div>
            <ListModal
              list={list}
              tick={tick ?? ''}
              onCancel={handleClose}
              amount={toModal.total}
              transfers={toModal.transfers}
            />
          )}
        </div>
      </Modal>
      <BottomSelect
        selectedCount={selectedTransfersByTick.transfers.length}
        dataCount={selectedTick?.transfers.length || 0}
        onChange={handleTranferRangeChange}
      >
        {isListed || (
          <button
            className={classNames(
              'px-[31px] py-[6px] border font-bold text-[20px] leading-[21px] transition rounded-[50px]',
              selectedTransfersByTick.transfers.length > 0
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
            selectedTransfersByTick.transfers.length > 0
              ? 'border-[#FFBB00] text-[#FFBB00]'
              : 'border-[#262626] text-[#262626] cursor-default',
          )}
          onClick={handleListByTickClick}
        >
          {buttonText} SELECTED ({selectedTransfersByTick.amount.toLocaleString()}{' '}
          {selectedTick?.tick})
        </button>
      </BottomSelect>
    </div>
  );
};
