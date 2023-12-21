import './App.css';
import Button from './components/Button/Button';
import Header from './components/Header/Header';
import Text from './components/Text/Text';
// import Footer from './components/Footer/Footer.tsx';
import { buttons, linksData } from './settings/settings.ts';
import { Fragment } from 'react';

const App = () => {
  return (
    <div className='App'>
      <div className={'app-container'}>
        <Header />
        <div className='min-h-screen mt-[-100px] flex-grow flex items-center justify-center'>
          <div className='w-[1080px]'>
            <div className='mb-24'>
              <Text />
            </div>
            <div className='flex justify-center py-1'>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  text={button.text}
                  SvgIcon={button.svg}
                  url={button.url}
                  className={'[&:not(:last-child)]:mr-[76px]'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <div className='bg-gradient-to-b from-transparent via-black/100 to-black/100'>*/}
      <div className={'bg-black pt-[30px]'}>
        <div className={'w-[1080px] mx-auto'}>
          <div
            className='w-full mx-auto  text-lg text-white mb-[20px]'
            id={'wallet'}
          >
            <h2 className='text-4xl font-bold mb-4'>Wallet</h2>
            <p>Nintondo Wallet for Bells - A New Horizon for Your Crypto Adventures!</p>
            <p>
              We're thrilled to introduce Nintondo Wallet, your newest companion in the whimsical
              world of Bells cryptocurrency. Inspired by the beloved universe of Animal Crossing,
              our wallet is more than just a tool; it's a delightful journey into the heart of a
              community where fun meets finance.
            </p>
          </div>

          <div
            className='w-full mx-auto text-lg text-white'
            id={'markets'}
          >
            <h2 className='text-4xl font-bold mb-4'>Markets</h2>
            <div className={'mb-[73px]'}>
              <p>Where to buy $BEL?</p>
              {linksData.map((section, index) => (
                <Fragment key={index}>
                  <p>{section.type}:</p>
                  <ul className='list-disc pl-4'>
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.link}
                          target={'_blank'}
                          className='underline'
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Fragment>
              ))}
            </div>
          </div>

          {/*<Footer />*/}
          <div style={{ width: '100%', height: '100%', border: '1px white solid' }}></div>
          <div className='text-center text-white text-4xl pt-[50px] pb-[73px] font-extrabold break-words'>
            NINTONDO.IO
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
