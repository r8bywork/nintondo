import axios from 'axios';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BigArrowRight from '../../../assets/BigArrowRight.svg?react';
import CopySvg from '../../../assets/copy.svg?react';
import { Transaction, VinFields, VoutFields } from '../../../settings/fields';
import { truncate } from '../../../settings/utils';
import TxHeader from './components/Txheader';
interface TransactionsProps {
  data: Transaction[];
}

const Transactions = ({ data }: TransactionsProps) => {
  const [isOpenMap, setIsOpenMap] = useState<{ [key: string]: boolean }>({});
  const [transaction, setTransactions] = useState([]);

  // const toggleDetails = (txid: string) => {
  //   setIsOpenMap((prevMap) => ({
  //     ...prevMap,
  //     [txid]: !prevMap[txid],
  //   }));
  // };
  const toggleDetails = async (txid: string) => {
    setIsOpenMap((prevMap) => ({
      ...prevMap,
      [txid]: !prevMap[txid],
    }));

    if (!isOpenMap[txid]) {
      const response = await axios.get(`https://bells.quark.blue/api/tx/${txid}/outspends`);
      console.log(response.data);
    }
  };
  const totalValues = data.map(
    (elem) => elem.vout.reduce((sum, voutElem) => sum + voutElem.value, 0) / 100000000,
  );

  return (
    <>
      {data.map((elem, idx) => (
        <div
          key={uuidv4()}
          className='p-[20px] mb-[20px] rounded-3xl border-[1px] border-white bg-black/20 backdrop-blur-[12px]'
        >
          <div className='flex justify-between pb-[15px]'>
            <div className='flex items-center'>
              <div className={'break-all bg-black text-[#FB0] text-[14px] mr-[5px]'}>
                <p className='md:hidden'>
                  {truncate(elem.txid, {
                    nPrefix: 11,
                    nSuffix: 11,
                  })}
                </p>
                <p className='max-md:hidden'>{elem.txid}</p>
              </div>
              <CopySvg onClick={() => navigator.clipboard.writeText(data[0].txid ?? '')} />
            </div>

            <button
              className='px-[25px] rounded-[17px] bg-[#FB0] text-black font-bold'
              onClick={() => toggleDetails(elem.txid)}
            >
              {isOpenMap[elem.txid] ? 'DETAILS-' : 'DETAILS+'}
            </button>
          </div>
          <div className='flex text-[14px] max-md:flex-col justify-between items-center'>
            <TxHeader
              amount={elem.vin[0]?.prevout?.value}
              coin='BEL'
              data={elem}
              fields={VinFields}
              vin
              isOpen={isOpenMap[elem.txid]}
            />
            <BigArrowRight className='transform max-md:rotate-90' />
            <TxHeader
              coin='BEL'
              data={elem}
              fields={VoutFields}
              isOpen={isOpenMap[elem.txid]}
            />
          </div>
          <div className='flex justify-end max-md:justify-center'>
            <p className='text-[#FB0] font-bold md:mr-[10px] max-md:mr-[30px]'>41 CONFIRMATIONS</p>
            <p className='text-[#FB0] font-bold'>{totalValues[idx]} BEL</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Transactions;
