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
}

const Table = <T extends object>({ data, fields, className, title, additional }: Props<T>) => {
  return (
    <div className={'w-full max-w-7xl' + className}>
      {title && (
        <div
          style={{ background: 'var(--GRD, linear-gradient(90deg, #FFF 0%, #FB0 99.07%))' }}
          className={
            'bg-[#FB0] relative top-1 ml-[20px] rounded-t-[15px] px-4 text-[24px] font-bold text-black w-fit'
          }
        >
          {title}
        </div>
      )}
      <div className={cn('rounded-[12px]', className)}>
        <div className={cn(s.container)}>
          <table
            className={s.table}
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
                        <tr
                          className={'bg-black'}
                          key={`table-row_${uuidv4()}`}
                        >
                          {additional && (
                            <th
                              key={`table-col_${idx}-value_${fdx}`}
                              className='bg-black text-left border-r-2 text-[#FFBB00]'
                            >
                              {f.name?.toString().toUpperCase()}
                            </th>
                          )}
                          <td
                            key={`table-row_${idx + 1}-value_${fdx + 1}`}
                            className={'whitespace-nowrap w-fit text-right'}
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
                      className={'bg-black'}
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
    </div>
  );
};

export default Table;
