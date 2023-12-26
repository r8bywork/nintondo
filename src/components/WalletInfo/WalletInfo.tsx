import wallet1 from '../../assets/walletScreens/wallet1.jpg';
import wallet2 from '../../assets/walletScreens/wallet2.jpg';
import wallet3 from '../../assets/walletScreens/wallet3.jpg';
import wallet4 from '../../assets/walletScreens/wallet4.jpg';
import wallet5 from '../../assets/walletScreens/wallet5.jpg';
import wallet6 from '../../assets/walletScreens/wallet6.jpg';
const WalletInfo = () => {
  const walletImages = [wallet1, wallet2, wallet3, wallet4, wallet5, wallet6];

  return (
    <div className='w-full mx-auto text-lg text-white'>
      <h2 className='text-4xl font-bold mb-4'>Wallet</h2>
      <p>Nintondo Wallet for Bells - A New Horizon for Your Crypto Adventures!</p>
      <p>🌿 Version 0.0.4 - Bringing the Charm of Animal Crossing to Cryptocurrency</p>
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
      <p>🍂 What's New in 0.0.4:</p>
      <ul className={'pl-4 list-disc'}>
        <li>
          <p>
            Launch of Nintondo Wallet: A fresh start with a familiar feel for all Bells enthusiasts
            and Animal Crossing fans.
          </p>
        </li>
        <li>
          <p>
            Enhanced UI: Navigate with ease through a user-friendly interface, adorned with charming
            Animal Crossing aesthetics.
          </p>
        </li>
        <li>
          <p>
            Improved Transaction Speed: Swift as a balloon gift floating across the sky, our
            enhanced transaction system ensures quick and efficient processing.
          </p>
        </li>
        <li>
          <p>
            Community Events: Participate in special events and challenges, bringing together the
            community spirit of Animal Crossing.
          </p>
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
      {/*list-disc pl-4*/}
      <br />
      <p className={'font-bold'}>📥 Download Now:</p> <br />
      <p>
        <a
          className={'underline'}
          href='https://github.com/Nintondo/extension/releases/download/0.0.7/chrome-0.0.7.zip'
        >
          Chrome Extension
        </a>
      </p>
      <br /> <br />
      <p>
        <a
          className={'underline'}
          href={'https://github.com/Nintondo/extension/releases/download/0.0.7/firefox-0.0.7.xpi'}
        >
          Firefox Extension
        </a>
      </p>
      <br />
      <p>
        Ready to embark on this enchanting crypto adventure? Download Nintondo Wallet for Bells and
        turn your cryptocurrency experience into an idyllic escapade. Let's make our financial
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
            className='w-full h-auto'
            src={image}
            alt={`Image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WalletInfo;
