import classNames from 'classnames';
import { ReactNode } from 'react';
import { v4 } from 'uuid';
import { Field, Transaction } from '../../../../settings/fields';
import s from './TxHeader.module.scss';
interface TxProps<T extends object> {
  id?: number;
  amount?: number;
  coin?: string;
  open?: boolean;
  vin?: boolean;
  vout?: boolean;
  data?: T[] | Transaction;
  fields: Field<T>[];
  isOpen?: boolean;
}
const TxHeader = <T extends object>({ amount, vin, fields, isOpen, data }: TxProps<T>) => {
  const transactions = vin ? data?.vin : data?.vout;
  const expandedTransactions = transactions?.map((item) =>
    vin && item.prevout ? { ...item, ...item.prevout } : item,
  );

  return (
    <div>
      {data &&
        expandedTransactions.map((item, idx: number) => (
          <div
            key={v4()}
            className='max-md:flex-col'
          >
            <div
              key={v4()}
              className='bg-black max-w-[450px] items-center break-all px-[20px] py-[10px] my-[10px] flex rounded-[38px]'
            >
              <p className='border-r-[2px] min-w-fit pr-[15px]'>#{idx}</p>
              <p className='text-[#53DCFF] pl-[15px] w-full pr-[15px]'>
                {item.txid || item.scriptpubkey_address}
              </p>
              <p className='pl-[15px] border-l-[2px] min-w-fit'>
                {amount / 100000000 || item?.value / 100000000}
              </p>
            </div>
            {isOpen && (
              <table
                key={v4()}
                className={classNames(
                  s.table,
                  'overflow-hidden border-separate border-spacing-y-[20px] my-[10px]',
                )}
              >
                <tbody>
                  {fields.map((field, fdx) => (
                    <tr key={`card_${idx}_field_${fdx}`}>
                      <th
                        key={`table-col_${idx}-value_${fdx}`}
                        className='bg-black text-left text-[#A8A8A8] block w-max'
                      >
                        {field.name?.toString().toUpperCase()}
                      </th>
                      <td className='break-all'>
                        {field.render
                          ? field.render(item[field.value], item)
                          : (item[field.value] as ReactNode)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
    </div>
  );
};
export default TxHeader;
