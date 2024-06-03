import ChromeIcon from '../../assets/ChromeIcon.svg?react';
import FirefoxIcon from '../../assets/firefox2019.svg?react';
import wallet1 from '../../assets/walletScreens/wallet1.jpg';
import wallet2 from '../../assets/walletScreens/wallet2.jpg';
import wallet3 from '../../assets/walletScreens/wallet3.jpg';
import wallet4 from '../../assets/walletScreens/wallet4.jpg';
import wallet5 from '../../assets/walletScreens/wallet5.jpg';
import wallet6 from '../../assets/walletScreens/wallet6.jpg';
import Exit from '../../assets/exit.svg?react';
import ArrowRight from '../../assets/arrowright.svg?react';
import ArrowLeft from '../../assets/arrowleft.svg?react';
import { useEffect, useState } from 'react';
import { GitHubRelease } from '@/interfaces/intefaces';
const WalletInfo = () => {
  const walletImages = [wallet1, wallet2, wallet3, wallet4, wallet5, wallet6];
  const [modalImage, setModalImage] = useState<string>('');
  const [gitData, setGitData] = useState<GitHubRelease>();
  const fetchLatestRelease = async (owner: string, repo: string) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }
    return await response.json();
  };

  useEffect(() => {
    fetchLatestRelease('Nintondo', 'extension').then((res) => setGitData(res));
  }, []);

  const changeImage = (direction: string) => {
    const currentImageIndex = walletImages.indexOf(modalImage);
    const totalImages = walletImages.length;
    const newIndex =
      (currentImageIndex + (direction === 'next' ? 1 : totalImages - 1)) % totalImages;
    setModalImage(walletImages[newIndex]);
  };

  const handleImageClick = (image: string) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage('');
  };

  return (
    <div className='w-full mx-auto text-lg text-white'>
      <h2 className='text-4xl font-bold mb-4'>Wallet</h2>
      <p>
        <b>Welcome to Nintondo Wallet!</b>
      </p>
      <p>
        <b>Your Ultimate Bells Coin Companion</b>
      </p>
      <br />
      <ul className={'ml-4 list-disc'}>
        <li>
          <p>
            <b>Store and Send Bells</b>: Securely manage your Bells coin with ease.
          </p>
        </li>
        <li>
          <p>
            <b>Seed Phrase Backup</b>: Safeguard your treasures by backing up your seed phrase.
          </p>
        </li>
        <li>
          <p>
            <b>Customizable Interface</b>: Personalize your wallet to match your unique style.
          </p>
        </li>
        <li>
          <p>
            <b>NFT Management</b>: View and send NFTs directly within your wallet.
          </p>
        </li>
      </ul>
      <br />
      <p>Start your adventure with Nintondo Wallet and keep your virtual village thriving!</p>
      <br />
      <p>
        <b>Download Now</b> (Latest Version: {gitData?.name || '0.1'}):
      </p>
      <br />
      <div className='ml-5'>
        <p className='flex items-center'>
          <ChromeIcon />
          <a
            className={'underline'}
            href={gitData?.assets[0].browser_download_url}
          >
            Chrome Extension
          </a>
        </p>
        <br />
        <p className='flex items-center'>
          <FirefoxIcon />
          <a
            className={'underline'}
            href={gitData?.assets[1].browser_download_url}
          >
            Firefox Extension
          </a>
        </p>
      </div>
      <br />
      <div className='grid grid-cols-3 gap-4'>
        {walletImages.map((image, index) => (
          <img
            key={index}
            className='w-full h-auto cursor-pointer'
            src={image}
            alt={`Image ${index + 1}`}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      {modalImage && (
        <div className='fixed inset-0 flex items-center z-50 bg-black bg-opacity-50 backdrop-blur-md'>
          <div className='p-5 relative rounded-lg max-w-lg mx-auto'>
            <button
              className='absolute top-1/2 left-1 bg-white rounded-full p-[5px]'
              onClick={() => changeImage('previous')}
            >
              <ArrowLeft />
            </button>
            <img
              className='w-full h-auto'
              src={modalImage}
              alt='Modal'
            />
            <button
              className='absolute top-1/2 right-1 bg-white rounded-full p-[5px]'
              onClick={() => changeImage('next')}
            >
              <ArrowRight />
            </button>
            <button
              className='absolute top-0 right-0 m-2 bg-white rounded-full p-[5px]'
              onClick={closeModal}
            >
              <Exit />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
