import cn from 'classnames';
import { ReactNode } from 'react';
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
}

const Table = <T extends object>({ data, fields, className, title }: Props<T>) => {
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
            <thead>
              <tr>
                {fields.map((i, idx) => (
                  <th key={`table-header_${idx}`}>{i.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((i, idx) => (
                <tr
                  className={'bg-black'}
                  key={`table-row_${idx}`}
                >
                  {fields.map((f, fdx) => (
                    <td
                      key={`table-row_${idx}-value_${fdx}`}
                      className={'whitespace-nowrap w-fit'}
                    >
                      {f.render ? f.render(i[f.value], i) : (i[f.value] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
