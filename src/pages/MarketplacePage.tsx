// import axios from 'axios';
// import { useState } from 'react';

import TabSelect from '@/components/Controls/TabSelect';
import FilterTag from '@/components/Controls/components/FilterTag';
import { Listed } from '@/components/MarketplacePages/Listed';
import { Orders } from '@/components/MarketplacePages/Orders';
import { ReactNode, useState } from 'react';

type Field = {
  title: string;
  component: ReactNode;
};

type MarketPlaceTabs = 'listed' | 'orders';

const MARKETPLACE_COMPONENTS: Record<MarketPlaceTabs, Field> = {
  listed: {
    title: 'LISTED',
    component: <Listed />,
  },
  orders: {
    title: 'ORDERS',
    component: <Orders />,
  },
};

const FIELDS = Object.entries(MARKETPLACE_COMPONENTS).map(([key, val]) => ({
  title: val.title,
  value: key as MarketPlaceTabs,
}));

const MarketplacePage = () => {
  const [activeTab, setActiveTab] = useState<MarketPlaceTabs>(FIELDS[0].value);

  return (
    <div className='min-h-screen max-w-[1700px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white p-4'>
      <div className='flex justify-between max-medium:flex-col gap-[30px]'>
        <div className='flex gap-[13px] items-center'>
          <TabSelect
            fields={FIELDS}
            activeTab={activeTab}
            onHandleChange={(tab) => setActiveTab(tab as MarketPlaceTabs)}
            buttonClassName='mt-0 max-md:mt-0 flex-1 mr-0 md:mr-0'
            className='flex-1 gap-[13px] max-medium:gap-[30px]'
          />
          <div className='my-[10px] w-fit items-center px-[10px] py-[7px] border-[2px] flex flex-wrap border-[#191919] rounded-[18px] max-medium:my-[0] max-medium:hidden'>
            <FilterTag
              activeColor='#FFBB00'
              active
              text='atom'
              classNames='text-[#000]'
            />
          </div>
        </div>
        <div className='flex gap-[13px] flex-wrap'>
          <div className='my-[10px] w-fit items-center px-[10px] py-[7px] border-[2px] flex flex-wrap flex-1 border-[#191920] rounded-[18px] max-medium:my-[0]'>
            <FilterTag
              activeColor='#FFBB00'
              active
              text='Price: Low → High'
              classNames='text-[#000] flex-1 align-center flex justify-center text-nowrap'
            />
          </div>
          <div className='my-[10px] w-fit flex-3 items-center px-[10px] py-[7px] border-[2px] hidden flex-wrap border-[#191919] rounded-[18px] max-medium:my-[0] max-medium:flex'>
            <FilterTag
              activeColor='#FFBB00'
              active
              text='atom'
              classNames='text-[#000] flex-1 align-center flex justify-center'
            />
          </div>
        </div>
      </div>
      {MARKETPLACE_COMPONENTS[activeTab].component}
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
