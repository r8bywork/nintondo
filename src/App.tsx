import './App.css';
// import Button from './components/Button/Button';
import Header from './components/Header/Header';
import Text from './components/Text/Text';
// import Footer from './components/Footer/Footer.tsx';
import { buttons, linksData } from './settings/settings.ts';
import { Fragment, useEffect, useState } from 'react';
import WalletInfo from './components/WalletInfo/WalletInfo.tsx';
import DownloadLink from './components/DownloadLink/DownloadLink.tsx';

const App = () => {
  const [scrollY, setScrollY] = useState(0);

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
        <Header />
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

      <div className={'bg-black px-[15px] h-full indent-[20px] '}>
        <div className={'wallet_info flex flex-wrap'}>
          <div
            className='w-[1080px] mx-auto py-[30px]'
            id={'wallet'}
          >
            <WalletInfo />
          </div>
        </div>
        <div className={'flex-wrap flex'}>
          <div className={'w-[1080px] mx-auto'}>
            <div
              id={'markets'}
              className={'text-white'}
            >
              <h2 className='text-4xl font-bold mb-4'>Markets</h2>
              <div className={'mb-[73px]'}>
                <p>Where to buy $BEL?</p> <br />
                {linksData.map((section, index) => (
                  <Fragment key={index}>
                    <p>{section.type}:</p> <br />
                    <ul className='list-disc pl-4'>
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.link}
                            target='_blank'
                            className='underline'
                            rel='noreferrer'
                          >
                            {link.name}
                          </a>
                          <br />
                          <br />
                        </li>
                      ))}
                    </ul>
                  </Fragment>
                ))}
              </div>
            </div>
            {/* <Footer />*/}
            <div className='w-full border border-white'></div>
            <div className='text-center text-white text-4xl pt-[50px] pb-[73px] font-extrabold break-words'>
              NINTONDO.IO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
