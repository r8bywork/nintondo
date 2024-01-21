import classNames from 'classnames';
import { get } from 'lodash';
import { ReactNode } from 'react';
import { v4 } from 'uuid';
import { Field, additionalFields, Transaction } from '../../../../settings/fields';
import s from './TxHeader.module.scss';

interface TxProps<T extends object> {
  // amount?: number;
  vin?: boolean;
  data?: Transaction;
  fields: Field<T>[];
  isOpen?: boolean;
  transaction?: additionalFields[];
}

const TxHeader = <T extends object>({
  // amount,
  vin,
  fields,
  isOpen,
  data,
  transaction,
}: TxProps<T>) => {
  const transactions = vin ? data?.vin : data?.vout;

  const expandedTransactions = transactions?.map((item, index: number) =>
    vin && 'prevout' in item
      ? { ...item, ...item.prevout }
      : { ...item, transaction: transaction?.[index] },
  );

  return (
    <div>
      {data &&
        expandedTransactions?.map((item: any, idx: number) => (
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
                {item?.txid || item.scriptpubkey_address}
              </p>
              <p className='pl-[15px] border-l-[2px] min-w-fit'>{item?.value / 100000000}</p>
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
                          ? field.render(get(item, field.value), item)
                          : (get(item, field.value) as ReactNode)}
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
