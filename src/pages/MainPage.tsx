import React, { useEffect, useState } from 'react';
import DownloadLink from '../components/Buttons/DownloadLink.tsx';
import Text from '../components/LandingTextBlocks/Text.tsx';
import WalletInfo from '../components/LandingTextBlocks/WalletInfo.tsx';
import { buttons } from '../settings/settings';
import './styles/MainPage.css';
import { useParams } from 'react-router-dom';
const MainPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const params = useParams();
  type Blocks = {
    [key: string]: React.MutableRefObject<HTMLElement | null>;
  };

  const blocks: Blocks = {
    wallet: React.createRef(),
    markets: React.createRef(),
  };

  const scrollToBlock = (block = '') => {
    const currentRef = blocks[block]?.current;

    if (currentRef && 'scrollIntoView' in currentRef) {
      currentRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBlock(params.anchor);
  }, [params]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='App'>
      <div
        className={'app-container'}
        style={{ backgroundPosition: `center -${scrollY}px` }}
      >
        {/* <Header /> */}
        <div className='main_screen'>
          <div className='mb-24'>
            <Text />
          </div>

          <div className='flex text-white gap-[24px] flex-wrap justify-center'>
            {buttons.map((button, index) => (
              <DownloadLink
                key={index}
                text={button.text}
                Icon={button.svg}
                href={button.url}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={'bg-black text-justify px-[15px] h-full indent-[20px] '}>
        <div className={'wallet_info flex flex-wrap'}>
          <div
            ref={blocks.wallet as React.RefObject<HTMLDivElement>}
            className='w-[1080px] mx-auto py-[30px]'
            id={'wallet'}
          >
            <WalletInfo />
          </div>
        </div>
        {/* <Footer />*/}
        <div className='bg-black w-full'>
          <div className='max-w-[1080px] mx-auto'>
            <div className='border border-white'></div>
            <div className='text-center text-white text-4xl pt-[50px] pb-[73px] font-extrabold break-words'>
              NINTONDO.IO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainPage;
