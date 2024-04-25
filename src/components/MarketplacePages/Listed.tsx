import Token from './Token/Token';
import Pagination from '../Table/Pagination';
import Arrow from '@/assets/TableArrow.svg?react';
import { ListedToken, ListedTokenCard } from '@/interfaces/marketapi';
import { Modal } from '../Modal';
import { useState } from 'react';
import './style.css';
// import { useTokenFilters } from '@/hooks/tokenFilters';

const generateFakeListedToken = (): ListedToken => ({
  tick: Math.random().toString(36).substring(2, 6).toUpperCase(),
  amount: Math.floor(Math.random() * 1000),
  outpoint: `${Math.random().toString(36).substring(2, 15)}:${Math.floor(Math.random() * 1000)}`,
  price: parseFloat((Math.random() * 100).toFixed(2)),
});

const generateFakeListedTokenCard = (totalTokens: number): ListedTokenCard => {
  const tokens = Array.from({ length: totalTokens }, generateFakeListedToken);
  return {
    pages: Math.ceil(totalTokens / 10),
    count: totalTokens,
    tokens,
  };
};

const tokens = generateFakeListedTokenCard(21);

const Listed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokensToBuy, setTokensToBuy] = useState<ListedToken[]>([]);
  // const { tokenCard, onPageChange } = useTokenFilters();
  const [selectedTokens, setSelectedBuyTokens] = useState<ListedToken[]>([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalCloseClick = () => {
    setTokensToBuy([]);
    closeModal();
  };

  const handleBuyClick = (token: ListedToken) => {
    setTokensToBuy([token]);
    openModal();
  };

  return (
    <div className='max-w-[1490px] mx-auto flex max-mobile:gap-[5px] gap-[10px] max-lg:justify-center flex-col pb-[72px]'>
      <div className='w-full mx-auto flex flex-wrap justify-center pt-[10px] max-mobile:gap-[5px] gap-[10px] max-lg:justify-center'>
        {tokens.tokens.map((f, i) => (
          <Token
            checked={selectedTokens.includes(f)}
            onBuyClick={() => handleBuyClick(f)}
            token={f}
            key={i}
            full
          />
        ))}
      </div>
      <Pagination
        activeClassName='bg-[#FFBB00] text-black'
        leftBtnPlaceholder={<Arrow />}
        rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
        buttonsClassName='flex items-center justify-center w-auto min-w-[2.25rem] px-[6px] h-9 bg-[#191919] rounded-full'
        currentPage={1}
        arrowsClassName='h-full flex items-center p-[10px] bg-[#191919] rounded-[26px]'
        className={
          'text-white flex justify-center pt-[30px] pb-[30px] items-center gap-x-[10px] text-center align-middle'
        }
        pageCount={300}
        onPageChange={() => {}}
      />
      <div className='fixed flex justify-center items-center w-screen bottom-0 left-0 h-[113px] mobile:h-[72px] backdrop-blur-sm border-t-[1px] border-[#191919]'>
        <div className='max-w-[1490px] flex justify-between px-5 w-full flex-col mobile:flex-row'>
          <div className='items-center flex gap-2 font-bold text-[16px] border-[1px] border-white rounded-[30px] h-[24px] w-[336px] justify-center px-[15px]'>
            {/* <input
              type='range'
              max={tokenCard.tokens.length}
              min={0}
              value={selectedTokens.length}
              onChange={(e) => {
                setSelectedBuyTokens(tokenCard.tokens.slice(0, Number(e.target.value)));
              }}
            /> */}
            <input
              type='range'
              className='styled-range'
              max={tokens.tokens.length}
              min={0}
              value={selectedTokens.length}
              onChange={(e) => {
                const tempSliderValue = Number(e.target.value);
                setSelectedBuyTokens(tokens.tokens.slice(0, tempSliderValue));

                const sliderEl = e.target as HTMLInputElement;
                const progress =
                  tokens.tokens.length === 0 ? 0 : (tempSliderValue / tokens.tokens.length) * 100;
                sliderEl.style.background = `linear-gradient(to right, #FFFFFF ${progress}%, #4b4b4b ${progress}%)`;
              }}
            />
            <span className='w-[16px]'>{selectedTokens.length}</span>
          </div>
          <p>SHIT2</p>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen
          onClose={closeModal}
        >
          <div className='bg-[#191919] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] rounded-[15px] py-[21px] px-[62px] flex flex-col gap-[34px] items-center'>
            <p className='text-[20px] font-bold'>Confirmation</p>
            <p className='text-[20px] text-[#4b4b4b]'>Please, confirm the transaction below:</p>
            <div>
              {tokensToBuy.map((value) => (
                <Token
                  token={value}
                  key={value.tick}
                  full
                />
              ))}
            </div>
            <div className='flex flex-col gap-[13px]'>
              <div className='flex gap-[z0px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>TOTAL VALUE</p>
                  <p className='text-[20px]'>8000000</p>
                </div>
                <div className='flex w-[200px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>sats</p>
                  <p className='text-[20px]'>~$5000.00</p>
                </div>
              </div>
              <div className='flex gap-[20px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>SERVICE FEE</p>
                  <p className='text-[20px]'>40000</p>
                </div>
                <div className='flex w-[200px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>sats</p>
                  <p className='text-[20px]'>~$25.29</p>
                </div>
              </div>
              <div className='flex gap-[20px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] flex-col gap-[10px]'>
                  <div className='flex justify-between'>
                    <p className='text-[20px] text-[#4B4B4B]'>TRANSACTION FEE RATE</p>
                    <p className='text-[20px]'>34</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-[20px] text-[#4B4B4B]'></p>
                    <p className='text-[20px]'>10778</p>
                  </div>
                </div>
                <div className='flex w-[200px] flex-col gap-[10px]'>
                  <div className='flex justify-between items-center'>
                    <p className='text-[20px] text-[#4B4B4B]'>sats/vB</p>
                    <button className='text-[20px] text-[#FFBB00] border border-[#FFBB00] px-2 rounded-[4px] leading-5'>
                      Customize
                    </button>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-[20px] text-[#4B4B4B]'>sats</p>
                    <p className='text-[20px]'>~$25.29</p>
                  </div>
                </div>
              </div>
              <div className='flex gap-[20px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] flex-col gap-[10px]'>
                  <div className='flex justify-between'>
                    <p className='text-[20px] text-[#4B4B4B]'>TOTAL</p>
                    <p className='text-[20px] text-[#FFBB00] font-bold'>~8,050,778</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-[20px]'></p>
                    <p className='text-[20px] text-[#4B4B4B]'>0.08050778</p>
                  </div>
                </div>
                <div className='flex w-[200px] flex-col gap-[10px]'>
                  <div className='flex justify-between items-center'>
                    <p className='text-[20px] text-[#4B4B4B]'>sats</p>
                    <p className='text-[20px]'>~$4325.29</p>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-[20px] text-[#4B4B4B]'>BTC</p>
                    <p className='text-[20px]'></p>
                  </div>
                </div>
              </div>
              <div className='flex gap-[20px] pb-[13px] border-b border-[#4B4B4B]'>
                <div className='flex w-[400px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>AVAILABLE BALANCE</p>
                  <p className='text-[20px] text-[#4B4B4B]'>0</p>
                </div>
                <div className='flex w-[200px] justify-between'>
                  <p className='text-[20px] text-[#4B4B4B]'>BTC</p>
                  <p className='text-[20px]'></p>
                </div>
              </div>
            </div>
            <div className='flex gap-[27px]'>
              <button
                onClick={handleModalCloseClick}
                className='py-[6px] px-[45px] rounded-full bg-[#fff] text-[#000] text-[20px] font-bold'
              >
                CANCEL
              </button>
              <button className='shadow-[0px_1px_18px_0px_#FFD45C80] py-[6px] px-[45px] rounded-full bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)] text-[#000] text-[20px] font-bold '>
                CONFIRM
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { Listed };
