import cn from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import Arrow from '../../assets/TableArrow.svg?react';
import { v4 as uuidv4 } from 'uuid';
import s from './styles.module.scss';
import Pagination from './Pagination.tsx';
type Field<T extends object> = {
  [K in keyof T]: {
    name: string | ReactNode;
    value: K;
    render?: (value: T[K], data: T) => ReactNode;
  };
}[keyof T];
type table = 'additional' | 'collections';

interface Props<T extends object> {
  data: T[];
  fields: Field<T>[];
  className?: string;
  title?: string;
  onClick?: () => void;
  marketplace?: boolean;
  mode?: table;
  selectedColumns?: (keyof T)[];
  pagination?: {
    recordsTotal: number;
    currentPage?: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
}
type FieldValue<T> = {
  [K in keyof T]: T[K];
};

const Table = <T extends object>({
  data,
  fields,
  className,
  title,
  onClick,
  marketplace,
  mode,
  selectedColumns,
  pagination,
}: Props<T>) => {
  const isMobile = window.innerWidth < 768;
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [filteredFields, setFilteredFields] = useState<Field<T>[]>([]);

  useEffect(() => {
    if (isMobile && selectedColumns) {
      setFilteredFields(fields.filter((field) => selectedColumns.includes(field.value)));
    } else {
      setFilteredFields(fields);
    }
  }, [isMobile, fields, selectedColumns]);

  useEffect(() => {
    if (isMobile && selectedColumns) {
      setFilteredData(
        data.map((item) => {
          return selectedColumns.reduce((newItem, columnName) => {
            newItem[columnName] = item[columnName];
            return newItem;
          }, {} as FieldValue<T>);
        }),
      );
    } else {
      setFilteredData(data);
    }
  }, [isMobile, data, selectedColumns]);

  if (marketplace) {
    return (
      <div className={'w-full max-w-7xl' + className}>
        {filteredData.map((item, idx) => (
          <div
            key={`card_${idx}`}
            className='overflow-hidden backdrop-blur-md mb-[10px]'
          >
            {filteredFields.map((field, fdx) => (
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

  if (isMobile && mode !== 'collections') {
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
          {filteredData.map((item, idx) => (
            <div
              key={`card_${idx}`}
              className='border border-[#FB0] rounded-[17px] overflow-hidden bg-black/60 backdrop-blur-md mb-[10px]'
            >
              {filteredFields.map((field, fdx) => (
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

  const TableMode = (mode: string) => {
    switch (mode) {
      case 'additional':
        return (
          <>
            {filteredData.map((i, idx) => (
              <React.Fragment key={`table_${uuidv4()}`}>
                {filteredFields.map((f, fdx) => (
                  <tr key={`table-row_${uuidv4()}`}>
                    <th
                      key={`table-col_${idx}-value_${fdx}`}
                      className='text-left text-[#FFBB00]'
                    >
                      {f.name?.toString().toUpperCase()}
                    </th>
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
        );
      default:
        return (
          <React.Fragment key={`table_${uuidv4()}`}>
            {filteredData.map((i, idx) => (
              <tr
                className={cn({
                  'bg-[#161A20] cursor-pointer': mode !== 'collections' && idx % 2 === 0,
                  'bg-[#020912] cursor-pointer': mode !== 'collections' && idx % 2 !== 0,
                })}
                key={`table-row_${idx}`}
              >
                {filteredFields.map((f, fdx) => (
                  <td
                    key={`table-row_${idx}-value_${fdx}`}
                    className={cn('whitespace-nowrap w-fit text-center', {
                      ['first:text-left text-right']: mode === 'collections',
                    })}
                  >
                    {f.render ? f.render(i[f.value], i) : (i[f.value] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </React.Fragment>
        );
    }
  };

  return (
    <div className={'w-full max-w-7xl' + className}>
      {title && (
        <div
          className={
            'bg-[#FB0] relative top-0 ml-[20px] rounded-t-[15px] px-4 text-[24px] font-bold text-black w-fit'
          }
        >
          <button onClick={onClick}>{title}</button>
        </div>
      )}

      <div
        id={'explorer'}
        className={cn(
          'mb-[20px] rounded-3xl',
          {
            ['border-[#FB0]']: mode === 'additional',
            ['border-none rounded-[0px]']: mode === 'collections',
          },
          s.container,
        )}
      >
        <table
          className={cn({
            [s.table]: mode !== ('additional' && 'collections'),
            [s.AdditionalTable]: mode === 'additional',
            [s.MarketplaceTable]: mode === 'collections',
          })}
          id='explorerTable'
        >
          {mode !== 'additional' && (
            <thead>
              <tr>
                {filteredFields.map((i, idx) => (
                  <th
                    key={`table-header_${idx}`}
                    className={cn('', {
                      ['bg-none text-[#FFBB00] leading-[20px] text-[20px] font-normal first:text-left text-right']:
                        mode === 'collections',
                      ['bg-[#FB0]']: mode !== 'collections',
                    })}
                  >
                    {i.name}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>{TableMode(mode || '')}</tbody>
        </table>
      </div>
      {pagination && (
        <div>
          <Pagination
            activeClassName='bg-[#FFBB00] text-black'
            leftBtnPlaceholder={<Arrow />}
            rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
            buttonsClassName='flex items-center justify-center w-auto min-w-[2.25rem] px-[6px] h-9 bg-[#191919] rounded-full'
            currentPage={pagination.currentPage ?? 1}
            arrowsClassName='h-full flex items-center p-[10px] bg-[#191919] rounded-[26px]'
            className={'flex justify-center items-center gap-x-[10px] text-center align-middle'}
            pageCount={pagination.pageCount}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
