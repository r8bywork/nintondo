import wallet1 from '../../assets/walletScreens/wallet1.jpg';
import wallet2 from '../../assets/walletScreens/wallet2.jpg';
import wallet3 from '../../assets/walletScreens/wallet3.jpg';
import wallet4 from '../../assets/walletScreens/wallet4.jpg';
import wallet5 from '../../assets/walletScreens/wallet5.jpg';
import wallet6 from '../../assets/walletScreens/wallet6.jpg';
import Exit from '../../assets/exit.svg?react';
import ArrowRight from '../../assets/arrowright.svg?react';
import ArrowLeft from '../../assets/arrowleft.svg?react';
import { useState } from 'react';
const WalletInfo = () => {
  const walletImages = [wallet1, wallet2, wallet3, wallet4, wallet5, wallet6];
  const [modalImage, setModalImage] = useState<string>('');

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
      <p>Nintondo Wallet for Bells - A New Horizon for Your Crypto Adventures!</p>
      <p>🌿 Version 0.1.1 - Bringing the Charm of Animal Crossing to Cryptocurrency</p>
      <p>🍃 Welcome to Nintondo Wallet! 🍃</p>
      <p>
        We're thrilled to introduce Nintondo Wallet, your newest companion in the whimsical world of
        Bells cryptocurrency. Inspired by the beloved universe of Animal Crossing, our wallet is
        more than just a tool; it's a delightful journey into the heart of a community where fun
        meets finance.
      </p>
      <br />
      <p>🌸 Key Features:</p>
      <ul className={'pl-4 list-disc'}>
        <li>
          <p>
            Village Marketplace: Just like your favorite Animal Crossing marketplace, trade and
            manage your Bells with ease and charm.
          </p>
        </li>
        <li>
          <p>
            Tom Nook's Security: Top-notch security measures, ensuring your Bells is as safe as a
            bell in Tom Nook's vault.
          </p>
        </li>
        <li>
          <p>
            Island Backup: Never lose your data with our Island Backup system, safeguarding your
            wallet like the serene islands of Animal Crossing.
          </p>
        </li>
        <li>
          <p>
            Nook Miles Rewards: Earn Nook Miles for every transaction, adding an exciting twist to
            your cryptocurrency journey.
          </p>
        </li>
        <li>
          <p>
            Customizable Interface: Personalize your wallet with themes and characters from Animal
            Crossing, making finance fun!
          </p>
        </li>
      </ul>
      <br />
      <p>🍂 What's New in 0.1.1:</p>
      <ul className={'pl-4 list-disc'}>
        <li>
          <p>Removed tidecoin leftovers</p>
        </li>
        <li>
          <p>Removed host permission from manifest</p>
        </li>
        <li>
          <p>Changed api provider to receive last bells price</p>
        </li>
        <li>
          <p>Added error handling for pushing txs</p>
        </li>
        <li>
          <p>Fixed keyring's bugs</p>
        </li>
      </ul>
      <br />
      <p>🌟 Join Our Community:</p>
      <p>
        Step into a world where your financial journey is intertwined with the charm and simplicity
        of Animal Crossing. Join our community, share tips, and make new friends, all while managing
        your Bells cryptocurrency. Let's create a community as heartwarming and supportive as the
        townsfolk of Animal Crossing!
      </p>
      <br />
      <p className={'font-bold'}>📥 Download Now:</p> <br />
      <p>
        <a
          className={'underline'}
          href='https://github.com/Nintondo/extension/releases/download/0.1.1/chrome-0.1.1.zip'
        >
          Chrome Extension
        </a>
      </p>
      <br /> <br />
      <p>
        <a
          className={'underline'}
          href={'https://github.com/Nintondo/extension/releases/download/0.1.1/firefox-0.1.1.xpi'}
        >
          Firefox Extension
        </a>
      </p>
      <br />
      <p>
        Ready to embark on this enchanting crypto adventure? Download Nintondo Wallet for Bells and
        turn your cryptocurrency experience into an idyllic escapade. Let`s make our financial
        journey not just profitable, but also delightful!
      </p>
      <p>
        Note: Nintondo Wallet is not affiliated with Nintendo or the Animal Crossing franchise.
        Bells is a meme cryptocurrency and should be enjoyed as part of a balanced financial
        portfolio.
      </p>
      <br />
      <p className={'mb-[20px]'}>Happy Bell Hunting! 🛎️</p>
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
