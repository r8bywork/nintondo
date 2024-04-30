// import axios from 'axios';
// import { useState } from 'react';

import TabSelect from '@/components/Controls/TabSelect';
import { Listed } from '@/components/MarketplacePages/Listed';
import { Orders } from '@/components/MarketplacePages/Orders';
import { ReactNode, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TickDropdown } from '@/components/MarketplacePages/components/TickDropdown';
import { Filter } from '@/components/MarketplacePages/components/Filter';

type Tab = {
  title: string;
  component: ReactNode;
  filter: ReactNode;
};

type MarketPlaceTabs = 'listed' | 'orders';

const SORT_FILTERS = {
  low: 'Price: Low → High',
  high: 'Price: High → Low',
  latest: 'List Time: Latest → Earliest',
  earliest: 'List Time: Earliest → Latest',
};

const EVENT_FILTERS = {
  listed: 'Listed',
  sold: 'Sold',
  unlisted: 'Unlisted',
};

const MARKETPLACE_COMPONENTS: Record<MarketPlaceTabs, Tab> = {
  listed: {
    title: 'LISTED',
    component: <Listed />,
    filter: (
      <Filter
        defaultFilter='low'
        filterKey='sort'
        filters={SORT_FILTERS}
      />
    ),
  },
  orders: {
    title: 'ORDERS',
    component: <Orders />,
    filter: (
      <Filter
        defaultFilter='listed'
        filterKey='event'
        filters={EVENT_FILTERS}
        tag='Event: '
      />
    ),
  },
};

const TABS = Object.entries(MARKETPLACE_COMPONENTS).map(([key, val]) => ({
  title: val.title,
  value: key as MarketPlaceTabs,
}));

const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleActiveTabChange = (tab: string) => {
    searchParams.set('tab', tab);
    searchParams.set('page', '1');

    setSearchParams(searchParams);
  };

  const currentTab = useMemo(() => {
    const fromSearchParams = searchParams.get('tab') || TABS[0].value;

    if (!Object.keys(MARKETPLACE_COMPONENTS).includes(fromSearchParams)) {
      return TABS[0].value;
    }

    return fromSearchParams;
  }, [searchParams]);

  return (
    <div className='min-h-screen max-w-[1600px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white p-4'>
      <div className='flex justify-between max-medium:flex-col gap-[13px]'>
        <div className='flex gap-[13px] items-center max-medium:items-stretch max-medium:flex-col max-medium:gap-[30px]'>
          <TabSelect
            fields={TABS}
            activeTab={currentTab}
            onHandleChange={handleActiveTabChange}
            buttonClassName='mt-0 max-md:mt-0 flex-1 mr-0 md:mr-0 py-[6px] px-[45px] leading-[21px] h-[33px] max-md:mr-0'
            className='flex-1 gap-[1px] max-medium:gap-[30px]'
          />
          <TickDropdown />
        </div>
        <div className='flex gap-[13px] flex-wrap'>
          {MARKETPLACE_COMPONENTS[currentTab as MarketPlaceTabs].filter}
        </div>
      </div>
      {MARKETPLACE_COMPONENTS[currentTab as MarketPlaceTabs].component}
    </div>
  );
};

// const MarketplacePage = () => {
//   const [data, setData] = useState<{
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     img_preview: any;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     meta: any;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     name: any;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     inscriptions: any[];
//   }>({
//     // eslint-disable-next-line camelcase
//     img_preview: undefined,
//     meta: '',
//     name: '',
//     inscriptions: [],
//   });

//   const sendShit = async () => {
//     if (!data.img_preview) return;

//     const reader = new FileReader();
//     reader.onloadend = async () => {
//       try {
//         const arrayBuffer = reader.result;
//         if (arrayBuffer === null || !(arrayBuffer instanceof ArrayBuffer)) return;
//         const base64String = btoa(
//           new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
//         );
//         const result = await axios.post(
//           'http://localhost:7777/collection',
//           {
//             // eslint-disable-next-line camelcase
//             img_preview_base64: base64String,
//             meta: data.meta,
//             name: data.name,
//             inscriptions: data.inscriptions,
//           },
//           {
//             withCredentials: true,
//           },
//         );
//         console.log(result.data);
//       } catch (error) {
//         console.error('Error uploading collection:', error);
//       }
//     };
//     reader.readAsArrayBuffer(data.img_preview);
//   };

//   return (
//     <div className='min-h-screen max-w-[1700px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white p-4'>
//       <input
//         type='file'
//         onChange={(e) => {
//           const file = e.target.files ? e.target.files[0] : undefined;
//           setData((prevData) => ({
//             ...prevData,
//             // eslint-disable-next-line camelcase
//             img_preview: file,
//             meta: 'METADATA',
//             inscriptions: [
//               {
//                 // eslint-disable-next-line camelcase
//                 content_type: 'SHIT',
//                 // eslint-disable-next-line camelcase
//                 inscription_id:
//                   '4a756e263c866bd687dbb7692c9aaa147f7a743f7eb4ae84af2ce22a0fe1f287i0',
//                 number: 2213,
//               },
//             ],
//             name: 'first collection',
//           }));
//         }}
//       />
//       <p className='text-blue'>{JSON.stringify(data)}</p>
//       <button onClick={sendShit}>Send shit</button>
//     </div>
//   );
// };

export default MarketplacePage;
