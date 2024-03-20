import axios from 'axios';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BigArrowRight from '../../assets/BigArrowRight.svg?react';
import CopySvg from '../../assets/copyOrange.svg?react';
import { VinFields, VoutFields } from '../../settings/fields.tsx';
import TxHeader from './components/TxHeader.tsx';
import Copy from '../Buttons/Copy.tsx';
import { additionalFields, Transaction } from '../../interfaces/intefaces.ts';
import { truncate } from '../../utils';
interface TransactionsProps {
  data: Transaction[];
  height?: number;
}

const Transactions = ({ data, height }: TransactionsProps) => {
  const [isOpenMap, setIsOpenMap] = useState<{ [key: string]: boolean }>({});
  const [transaction, setTransaction] = useState<Record<string, additionalFields[]>>({});
  const toggleDetails = async (txid: string) => {
    setIsOpenMap((prevMap) => ({
      ...prevMap,
      [txid]: !prevMap[txid],
    }));

    if (!isOpenMap[txid]) {
      const response = await axios.get(`https://bells.quark.blue/api/tx/${txid}/outspends`);
      setTransaction((prevTransactions) => ({
        ...prevTransactions,
        [txid]: response.data,
      }));
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
          className='p-[20px] mb-[20px] rounded-3xl border-[1px] border-white bg-black/60 backdrop-blur-[12px]'
        >
          <div className='flex justify-between text-[14px] pb-[15px]'>
            <div className='flex items-center'>
              <div className={'break-all px-[10px] rounded-[10px] bg-black text-[#FB0] mr-[5px]'}>
                <p className='md:hidden'>
                  {truncate(elem.txid, {
                    nPrefix: 11,
                    nSuffix: 11,
                  })}
                </p>
                <p className='max-md:hidden'>{elem.txid}</p>
              </div>
              <Copy
                text={data[0].txid}
                SvgIcon={CopySvg}
              />
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
              data={elem}
              fields={VinFields}
              vin
              isOpen={isOpenMap[elem.txid]}
            />
            <BigArrowRight className='transform max-md:rotate-90 mx-[20px]' />
            {transaction && (
              <TxHeader
                data={elem}
                transaction={transaction[elem.txid]}
                fields={VoutFields}
                isOpen={isOpenMap[elem.txid]}
              />
            )}
          </div>
          <div className='flex justify-end font-bold text-[#FB0] text-[14px] max-md:justify-center'>
            <p className='md:mr-[10px] max-md:mr-[30px]'>
              {height
                ? height === elem.status.block_height
                  ? '1 CONFIRMATION'
                  : `${height - elem.status.block_height + 1} CONFIRMATIONS`
                : elem.status.confirmed
                  ? 'Confirmed'
                  : 'Unconfirmed'}
            </p>
            <p>{totalValues[idx]} BEL</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Transactions;
