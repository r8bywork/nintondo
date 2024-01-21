import classNames from 'classnames';
import { get } from 'lodash';
import { ReactNode } from 'react';
import { v4 } from 'uuid';
import { Field, additionalFields, Transaction } from '../../../../settings/fields';
import s from './TxHeader.module.scss';
import { truncate } from '../../../../settings/utils.ts';

interface TxProps<T extends object> {
  vin?: boolean;
  data?: Transaction;
  fields: Field<T>[];
  isOpen?: boolean;
  transaction?: additionalFields[];
}

const TxHeader = <T extends object>({ vin, fields, isOpen, data, transaction }: TxProps<T>) => {
  const transactions = vin ? data?.vin : data?.vout;

  const expandedTransactions = transactions?.map((item, index: number) =>
    vin && 'prevout' in item
      ? { ...item, ...item.prevout }
      : { ...item, transaction: transaction?.[index] },
  );

  const getTruncated = () => {
    switch (true) {
      case window.innerWidth <= 800:
        return 15;
      case window.innerWidth < 950:
        return 20;
      default:
        return 50;
    }
  };

  return (
    <div>
      {data &&
        expandedTransactions?.map((item: any, idx: number) => (
          <div
            key={v4()}
            className='max-md:flex-col'
          >
            {/*<div*/}
            {/*  key={v4()}*/}
            {/*  className='bg-black max-w-[450px] items-center break-all px-[20px] py-[10px] my-[10px] flex rounded-[38px]'*/}
            {/*>*/}
            {/*  <p className='border-r-[2px] min-w-fit pr-[15px]'>#{idx}</p>*/}
            {/*  <p className='text-[#53DCFF] pl-[15px] w-full pr-[15px]'>*/}
            {/*    {item.is_coinbase ? 'Coinbase' : item?.txid || item?.scriptpubkey_address}*/}
            {/*  </p>*/}
            {/*  <p className='pl-[15px] border-l-[2px] min-w-fit'>*/}
            {/*    {item.is_coinbase ? '' : item?.value / 100000000}*/}
            {/*  </p>*/}
            {/*</div>*/}
            <table
              key={v4()}
              className='bg-black items-center break-all px-[20px] py-[10px] my-[10px] flex rounded-[38px]'
            >
              <tbody>
                <tr className={'flex items-center'}>
                  <td className='border-r-[2px] min-w-fit pr-[15px]'>#{idx}</td>
                  <td className='text-[#53DCFF] pl-[15px] pr-[15px]'>
                    <p className={'text-[#53DCFF]'}>
                      {/*{item.is_coinbase ? 'Coinbase' : item?.txid || item?.scriptpubkey_address}*/}
                      {truncate(
                        item.is_coinbase ? 'Coinbase' : item?.txid || item?.scriptpubkey_address,
                        {
                          nPrefix: getTruncated(),
                          nSuffix: getTruncated(),
                        },
                      )}
                    </p>
                  </td>
                  <td className='pl-[15px] border-l-[2px] min-w-fit'>
                    {item.is_coinbase ? '' : item?.value / 100000000}
                  </td>
                </tr>
              </tbody>
            </table>

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
                        {get(item, field.value) ? (
                          field.render ? (
                            field.render(get(item, field.value), item)
                          ) : (
                            (get(item, field.value) as ReactNode)
                          )
                        ) : (
                          <p>Loading...</p>
                        )}
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
