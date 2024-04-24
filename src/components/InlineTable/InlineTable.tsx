import classNames from 'classnames';
import { ReactNode } from 'react';

export type Field = {
  title: string;
  key: string;
  canBeSorted?: boolean;
};

export type Item = {
  id: string;
  field: {
    [key: string]: {
      value: ReactNode;
      additional?: ReactNode;
      under?: ReactNode;
      marked?: boolean;
      bold?: boolean;
    };
  };
};

interface InlineTableProps {
  fields: Field[];
  data: Item[];
  firstCellClassName?: string;
  cellClassName?: string;
  onRowClick?: () => void;
}

export const InlineTable = ({
  fields,
  data,
  firstCellClassName,
  cellClassName,
  onRowClick,
}: InlineTableProps) => {
  return (
    <table className='w-full'>
      <thead>
        <tr>
          {fields.map((field, idx) => (
            <th
              className={classNames(
                'text-[20px] text-[#FFBB00] pb-[16px] font-normal',
                idx === 0 ? 'text-left' : 'text-right text-nowrap',
                idx === 0 ? firstCellClassName : cellClassName,
              )}
              key={field.key}
            >
              {field.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIdx) => (
          <tr
            key={item.id}
            onClick={onRowClick}
          >
            {fields.map((field, cellIdx) => (
              <td
                className={classNames(
                  'text-[20px] pt-[13px] pb-[16px] border-[#4B4B4B] text-nowrap',
                  cellIdx === 0 ? 'text-left' : 'text-right',
                  item.field[field.key].marked ? 'text-[#53DCFF]' : 'text-[#fff]',
                  {
                    'border-b': rowIdx !== data.length - 1,
                    'font-bold': item.field[field.key].bold,
                  },
                  cellIdx === 0 ? firstCellClassName : cellClassName,
                )}
                key={field.key}
              >
                <p>
                  {item.field[field.key].value}
                  <span className='text-[#4B4B4B] font-normal'>
                    {' '}
                    {item.field[field.key].additional}
                  </span>
                </p>
                <p className='font-bold text-[#4B4B4B]'>{item.field[field.key].under}</p>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
