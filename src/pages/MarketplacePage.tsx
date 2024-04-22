// import axios from 'axios';
// import { useState } from 'react';

const MarketplacePage = () => {
  return (
    <div className='min-h-screen max-w-[1700px] mx-auto flex pt-[150px] flex-col text-white gap-4 text-white p-4'>
      <div>
        <div>
          <button>LISTED</button>
          <button>ORDERS</button>
        </div>
        <div>
          <p>HERE WILL BE FILTRATION</p>
        </div>
      </div>
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
