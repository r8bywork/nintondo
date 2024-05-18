// import TabSelect from '@/components/Controls/TabSelect';
import TabSelect from '@/components/Controls/TabSelect';
import { List } from '@/components/WalletPagePages/List';
import { useNintondoManagerContext } from '@/utils/bell-provider';
// import { MARKET_API_URL } from '@/consts';
// import { useMakeAuthRequests } from '@/hooks/auth';
// import { useGetUserTokens } from '@/hooks/electrs';
// import { useCreateListedSignedPSBT } from '@/hooks/market';
// import { IToken, ITransfer } from '@/interfaces/intefaces';
// import { useNintondoManagerContext } from '@/utils/bell-provider';
// import axios from 'axios';
import { ReactNode, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { History } from '../components/WalletPagePages/History'
// import { useSearchParams } from 'react-router-dom';

type Tab = {
  title: string;
  component: ReactNode;
};

type WalletPageTabs = 'for-sale' | 'listed' | 'history' | 'collections';

const WALLET_PAGE_COMPONENTS: Record<WalletPageTabs, Tab> = {
  'for-sale': {
    title: 'LIST FOR SALE',
    component: <List />,
  },
  listed: {
    title: 'LISTED',
    component: <List isListed />,
  },
  history: {
    title: 'HISTORY',
    component: <History />,
  },
  collections: {
    title: 'COLLECTIONS',
    component: <>Collections</>,
  },
};

const TABS = Object.entries(WALLET_PAGE_COMPONENTS).map(([key, val]) => ({
  title: val.title,
  value: key as WalletPageTabs,
}));

const WalletPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { verifiedAddress } = useNintondoManagerContext();

  const handleActiveTabChange = (tab: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tab', tab);

    setSearchParams(searchParams);
  };

  const currentTab = useMemo(() => {
    const fromSearchParams = searchParams.get('tab') || TABS[0].value;

    if (!Object.keys(WALLET_PAGE_COMPONENTS).includes(fromSearchParams)) {
      return TABS[0].value;
    }

    return fromSearchParams;
  }, [searchParams]);

  if (!verifiedAddress)
    return (
      <div className={'bg-black'}>
        <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white'>
          Please connect your wallet
        </div>
      </div>
    );

  return (
    <div className='max-w-[1440px] gap-6 px-[25px] mx-auto flex pt-[150px] max-medium:pt-[88px] flex-col text-white'>
      <TabSelect
        fields={TABS}
        activeTab={currentTab}
        onHandleChange={handleActiveTabChange}
        buttonClassName='mt-0 flex-1 py-[10px] min-w-[230px] px-[45px] leading-[21px] h-[40px] mr-0 max-md:mr-0 md:mr-0'
        className='flex-1 gap-[15px] flex-wrap bg-[#000]'
      />

      <div className='max-medium:pt-[52px]'>
        {WALLET_PAGE_COMPONENTS[currentTab as WalletPageTabs].component}
      </div>
    </div>
  );
};

// const WalletPage = () => {
//   const [userTokens, setUserTokens] = useState<IToken[]>([]);
//   const getUserTokens = useGetUserTokens();
//   const { verifiedAddress, inscribeTransfer } = useNintondoManagerContext();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [_amouts, setAmounts] = useState<{ tick: string; amnt: number }[]>([]);
//
//   const [price, setPrice] = useState<number>(0);
//
//   const makeAuthRequest = useMakeAuthRequests();
//
//   const createListedSignedPSBT = useCreateListedSignedPSBT();
//
// const inscribe = async (tick: string) => {
//   const amount = await inscribeTransfer(tick);
//   if (amount) setAmounts((prev) => [...prev, { amnt: amount, tick }]);
// };
//
//   const listToken = async (transfer: ITransfer) => {
//     const txid = transfer.inscription_id.slice(0, -2);
//     const vout = Number(transfer.inscription_id.slice(-1));
//     const psbt = await createListedSignedPSBT({ txid, vout }, price * transfer.amount);
//     if (psbt) {
//       const response = await makeAuthRequest(() =>
//         axios.post(`${MARKET_API_URL}/list-token`, psbt, { withCredentials: true }),
//       );
//       console.log(response);
//     }
//   };
//
//   useEffect(() => {
//     getUserTokens().then((tokens) => {
//       if (tokens) setUserTokens(tokens);
//     });
//   }, [getUserTokens]);
//
//   // if (!verifiedAddress)
//   //   return (
//   //     <div className={'bg-black'}>
//   //       <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white'>
//   //         Please connect your wallet
//   //       </div>
//   //     </div>
//   //   );
//
//   return (
//     <div className='min-h-screen max-w-[1700px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white p-4'>
//       <input
//         type='number'
//         className='text-black'
//         placeholder='price'
//         onChange={(e) => setPrice(Number(e.target.value))}
//         value={price}
//       />
//       <div></div>
//       {userTokens.map((f, i) => (
//         <div
//           key={i}
//           className='flex flex-col'
//         >
//           <p>{f.tick}</p>
//           <button
//             onClick={() => {
//               inscribe(f.tick);
//             }}
//           >
//             Inscribe MORE TRANSFERs
//           </button>
//           <div>
//             {f.transfers.map((transfer, transferId) => (
//               <div
//                 key={transferId}
//                 className='flex w-full justify-between'
//               >
//                 <p>{transfer.amount}</p>
//                 <button
//                   onClick={() => {
//                     listToken(transfer);
//                   }}
//                 >
//                   List
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

export default WalletPage;
