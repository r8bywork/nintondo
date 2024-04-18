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
        <span className={'text-white text-[18px] inline-block mb-[40px]'}>
          We want to clarify that the information provided about cryptocurrencies and the links to
          various exchanges on our website are for informational purposes only. We do not endorse,
          verify, or vouch for the reliability of these exchanges. Cryptocurrency investments carry
          inherent risks, and we strongly advise you to exercise due diligence, use your best
          judgment, and consult with financial experts if necessary before engaging in any
          transactions. Remember to carefully assess your risk tolerance and invest responsibly.
        </span>
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
