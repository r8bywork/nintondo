import cn from 'classnames';
import React, { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import s from './styles.module.scss';
type Field<T extends object> = {
  [K in keyof T]: {
    name: string | ReactNode;
    value: K;
    render?: (value: T[K], data: T) => ReactNode;
  };
}[keyof T];

interface Props<T extends object> {
  data: T[];
  fields: Field<T>[];
  className?: string;
  title?: string;
  additional?: boolean;
  onClick?: () => void;
  marketplace?: boolean;
}

const Table = <T extends object>({
  data,
  fields,
  className,
  title,
  additional,
  onClick,
  marketplace,
}: Props<T>) => {
  const isMobile = window.innerWidth < 768;

  if (marketplace) {
    return (
      <div className={'w-full max-w-7xl' + className}>
        {data.map((item, idx) => (
          <div
            key={`card_${idx}`}
            className='overflow-hidden backdrop-blur-md mb-[10px]'
          >
            {fields.map((field, fdx) => (
              <div
                key={`card_${idx}_field_${fdx}`}
                className='flex bg-[#191919] px-[30px] max-lg:px-[10px] last:pb-[25px] first:rounded-t-[15px] last:rounded-b-[15px] first:pt-[15px]'
              >
                <div className='text-[#4B4B4B] py-[7px] text-[20px] border-b-[1px] border-b-[#4b4b4b]  w-full'>
                  {field.name?.toString().toUpperCase()}
                </div>
                <div className='whitespace-nowrap py-[7px] text-white text-[20px] border-b-[1px] border-b-[#4b4b4b]'>
                  {field.render
                    ? field.render(item[field.value], item)
                    : (item[field.value] as ReactNode)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={'w-full max-w-7xl' + className}>
        {title && (
          <div className='text-center'>
            <div
              style={{ background: 'var(--GRD, linear-gradient(90deg, #FFF 0%, #FB0 99.07%))' }}
              className={
                'bg-[#FB0] relative top-0 inline-block rounded-t-[15px] px-4 text-[24px] font-bold text-black'
              }
            >
              <button onClick={onClick}>{title}</button>
            </div>
          </div>
        )}
        <div className={cn('rounded-[12px]', className)}>
          {data.map((item, idx) => (
            <div
              key={`card_${idx}`}
              className='border border-[#FB0] rounded-[17px] overflow-hidden bg-black/60 backdrop-blur-md mb-[10px]'
            >
              {fields.map((field, fdx) => (
                <div
                  key={`card_${idx}_field_${fdx}`}
                  className='my-2 flex bg-black px-4'
                >
                  <div className='text-[#FFBB00] w-full max-w-[140px]'>
                    {field.name?.toString().toUpperCase()}
                  </div>
                  <div className='whitespace-nowrap text-left'>
                    {field.render
                      ? field.render(item[field.value], item)
                      : (item[field.value] as ReactNode)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={'w-full max-w-7xl' + className}>
      {title && (
        <div
          // style={{ background: 'var(--GRD, linear-gradient(90deg, #FFF 0%, #FB0 99.07%))' }}
          className={
            'bg-[#FB0] relative top-0 ml-[20px] rounded-t-[15px] px-4 text-[24px] font-bold text-black w-fit'
          }
        >
          <button onClick={onClick}>{title}</button>
        </div>
      )}

      <div
        className={cn(
          'mb-[20px] rounded-[20px]',
          { ['border border-[#FB0] rounded-3xl']: additional },
          s.container,
        )}
      >
        <table
          className={cn({
            [s.table]: !additional,
            [s.AdditionalTable]: additional,
          })}
          id='explorerTable'
        >
          {!additional && (
            <thead>
              <tr>
                {fields.map((i, idx) => (
                  <th
                    key={`table-header_${idx}`}
                    className='bg-[#FB0]'
                  >
                    {i.name}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {additional ? (
              <>
                {data.map((i, idx) => (
                  <React.Fragment key={`table_${uuidv4()}`}>
                    {fields.map((f, fdx) => (
                      <tr key={`table-row_${uuidv4()}`}>
                        {additional && (
                          <th
                            key={`table-col_${idx}-value_${fdx}`}
                            className='text-left text-[#FFBB00]'
                          >
                            {f.name?.toString().toUpperCase()}
                          </th>
                        )}
                        <td
                          key={`table-row_${idx + 1}-value_${fdx + 1}`}
                          className={'whitespace-nowrap'}
                        >
                          {f.render ? f.render(i[f.value], i) : (i[f.value] as ReactNode)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <React.Fragment key={`table_${uuidv4()}`}>
                {data.map((i, idx) => (
                  <tr
                    className={
                      idx % 2 === 0 ? 'bg-[#161A20] cursor-pointer' : 'bg-[#020912] cursor-pointer'
                    }
                    key={`table-row_${idx}`}
                  >
                    {fields.map((f, fdx) => (
                      <td
                        key={`table-row_${idx}-value_${fdx}`}
                        className={'whitespace-nowrap w-fit text-center '}
                      >
                        {f.render ? f.render(i[f.value], i) : (i[f.value] as ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
