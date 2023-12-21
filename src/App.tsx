import './App.css';
import WalletIcon from './assets/wallet.svg?react';
import Button from './components/Button/Button';
import Header from './components/Header/Header';
import Text from './components/Text/Text';

const buttons = [
  { text: 'Wallet', svg: WalletIcon, url: '/wallet' },
  { text: 'Market', svg: WalletIcon, url: '/market' },
  { text: 'Explorer', svg: WalletIcon, url: '/explorer' },
];

const App = () => {
  return (
    <div className='App'>
      <Header />
      <div className='absolute left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4 w-[1080px]'>
        <div className={'mb-24'}>
          <Text />
        </div>
        <div className='flex justify-between py-1'>
          {buttons.map((button, index) => (
            <Button
              key={index}
              text={button.text}
              SvgIcon={button.svg}
              url={button.url}
              className={'[&:not(:last-child)]:mr-16'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default App;
