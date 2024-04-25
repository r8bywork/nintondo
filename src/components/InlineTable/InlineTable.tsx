import classNames from 'classnames';

export type Field = {
  title: string;
  key: string;
  canBeSorted?: boolean;
  Component?: JSX.ElementType;
};

export type ItemField = {
  [key: string]: {
    value: string;
    additional?: string;
    under?: string;
    marked?: boolean;
    bold?: boolean;
  };
};

interface InlineTableProps {
  fields: Field[];
  data: ItemField[];
  firstCellClassName?: string;
  cellClassName?: string;
  onRowClick?: (item: ItemField) => void;
  underClassName?: string;
  selectedId?: string;
  keyId?: string;
}

export const InlineTable = ({
  fields,
  data,
  firstCellClassName,
  cellClassName,
  onRowClick,
  underClassName,
  keyId = 'id',
  selectedId,
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
            className={classNames({
              'hover:bg-[rgba(255,255,255,0.1)] cursor-pointer': Boolean(onRowClick),
            })}
            key={item[keyId].value}
            onClick={() => onRowClick?.(item)}
          >
            {fields.map((field, cellIdx) => (
              <td
                className={classNames(
                  'text-[20px] pt-[13px] pb-[16px] border-[#4B4B4B] text-nowrap leading-[21px]',
                  cellIdx === 0 ? 'text-left' : 'text-right',
                  {
                    'border-b': rowIdx !== data.length - 1,
                    'font-bold': item[field.key].bold,
                  },
                  selectedId === item[keyId].value ? 'text-[#FFBB00]' : 'text-[#fff]',
                  cellIdx === 0 ? firstCellClassName : cellClassName,
                )}
                key={field.key}
              >
                {field.Component ? (
                  <field.Component
                    under={item[field.key].under}
                    additional={item[field.key].additional}
                    item={item}
                  >
                    {item[field.key].value}
                  </field.Component>
                ) : (
                  <>
                    <p className={classNames(item[field.key].marked && 'text-[#53DCFF]')}>
                      {item[field.key].value}
                      <span className='text-[#4B4B4B] font-normal'>
                        {' '}
                        {item[field.key].additional}
                      </span>
                    </p>
                    <p className={classNames('text-[#4B4B4B] leading-[21px]', underClassName)}>
                      {item[field.key].under}
                    </p>
                  </>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
