import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { truncate } from './utils';

type Field<T extends object> = {
  [K in keyof T]: {
    name: string | ReactNode;
    value: K;
    render?: (value: T[K], data: T) => ReactNode;
  };
}[keyof T];

export interface TxApiResponse {
  fee: number;
  txid: string;
  locktime: number;
  size: number;
  version: number;
}

export interface BlockStatus {
  height: number;
  is_best_chain: true;
  next_best: string;
}

export interface BlockData {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash: string;
  mediantime: number;
  nonce: number;
  bits: number;
  difficulty: number;
  in_best_chain: boolean;
  next_best: string;
}

export interface TransactionData {
  txid: string;
  fee: number;
  vsize: number;
  value: number;
}
export const formatDate = (dateString: number) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const date = new Date(dateString * 1000);
  return date
    .toLocaleDateString('ru-RU', options)
    .replace(/: /g, ':')
    .replace(/, /g, ' ')
    .replace(/\./g, '-');
};

export const BlockConfig: Field<BlockData>[] = [
  {
    value: 'height',
    name: 'Height',
    render: (value, data: BlockData) => (
      <Link to={`/explorer/block/${data.id}`}>
        <p className='text-[#53DCFF]'>{value}</p>
      </Link>
    ),
  },
  {
    value: 'timestamp',
    name: 'Timestamp',
    render: (value) => <p>{formatDate(value)}</p>,
  },
  {
    value: 'tx_count',
    name: 'Transactions',
  },
  {
    value: 'size',
    name: 'Size (KB)',
  },
  {
    value: 'weight',
    name: 'Weight (KWU)',
  },
];

export const TransactionConfig: Field<TransactionData>[] = [
  {
    value: 'txid',
    name: 'Transaction ID',
    render: (value) => (
      <>
        <p className={'max-md:hidden text-[#53DCFF]'}>{value}</p>
        <p className={'md:hidden text-[#53DCFF]'}>
          {truncate(value, {
            nPrefix: 4,
            nSuffix: 4,
          })}
        </p>
      </>
    ),
  },
  {
    value: 'fee',
    name: 'Fee',
  },
  {
    value: 'vsize',
    name: 'Virtual Size',
  },
  {
    value: 'value',
    name: 'Value',
  },
];

export const AdditionalBlockFields: Field<BlockData>[] = [
  {
    value: 'height',
    name: 'Height',
    render: (value) => <p className='text-[#53DCFF]'>{value}</p>,
  },
  {
    value: 'in_best_chain',
    name: 'Status',
    render: (value) => <p>{value ? 'In best chain' : 'false'}</p>,
  },
  {
    value: 'timestamp',
    name: 'Timestamp',
    render: (value) => <p>{formatDate(value)}</p>,
  },
  {
    value: 'size',
    name: 'Size',
    render: (value) => <p>{(value / 1024).toFixed(3)} KB</p>,
  },
  {
    value: 'size',
    name: 'Virtual Size',
    render: (value) => <p>{Math.ceil(value / 1024).toFixed(3)} vKB</p>,
  },
  {
    value: 'weight',
    name: 'Weight Units',
    render: (value) => <p>{(value / 1000).toFixed(2)} KWU</p>,
  },
  {
    value: 'version',
    name: 'Version',
  },
  {
    value: 'merkle_root',
    name: 'Merkle root',
    render: (value) => (
      <>
        <p className={'max-md:hidden text-[#53DCFF]'}>{value}</p>
        <p className={'md:hidden text-[#53DCFF]'}>
          {truncate(value, {
            nPrefix: 6,
            nSuffix: 6,
          })}
        </p>
      </>
    ),
  },
  {
    value: 'bits',
    name: 'Bits',
  },
  {
    value: 'difficulty',
    name: 'Difficulty',
  },
  {
    value: 'nonce',
    name: 'Nonce',
  },
];
