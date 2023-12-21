import './App.css';
// import WalletIcon from './assets/wallet.svg?react';
import NewWalletIcon from './assets/newwallet.svg?react';
import Button from './components/Button/Button';
import Header from './components/Header/Header';
import Text from './components/Text/Text';
import Footer from './components/Footer/Footer.tsx';

const buttons = [
  { text: 'Wallet', svg: NewWalletIcon, url: '/wallet' },
  { text: 'Market', svg: NewWalletIcon, url: '/market' },
  { text: 'Explorer', svg: NewWalletIcon, url: '/explorer' },
];

const App = () => {
  return (
    <div className='App'>
      <Header />
      <main className='min-h-screen mt-[-100px] flex-grow flex items-center justify-center'>
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
      </main>
      <footer className='bg-gradient-to-b from-transparent via-black/100 to-black/0'>
        <div className={'w-[1080px] mx-auto'}>
          <Footer />
          <div style={{ width: '100%', height: '100%', border: '1px white solid' }}></div>
          <div className='text-center text-white text-4xl pt-[50px] pb-[73px] font-extrabold break-words'>
            NINTONDO.IO
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
