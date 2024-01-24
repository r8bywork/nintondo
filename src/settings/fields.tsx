import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { truncate } from './utils';

export type Field<T extends object> = {
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

export interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  size: number;
  weight: number;
  fee: number;
  status: TransactionStatus;
}

export interface Vin {
  txid: string;
  vout: number;
  prevout: Vout;
  scriptsig: string;
  scriptsig_asm: string;
  is_coinbase: boolean;
  sequence: number;
  scriptpubkey_asm: string;
  scriptpubkey_address: string;
  value: number;
}

export interface Vout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  txid: string;
  scriptpubkey_address: string;
  value: number;
  transaction: additionalFields;
}

export interface additionalFields {
  spent: boolean;
  txid: string;
  vin: 0;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
}

interface TransactionStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
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
        <p className='text-[#FFFFFF]'>{value}</p>
      </Link>
    ),
  },
  {
    value: 'timestamp',
    name: 'Timestamp',
    render: (value, data: BlockData) => (
      <Link to={`/explorer/block/${data.id}`}>
        <p className='text-[#FFFFFF]'>{formatDate(value)}</p>
      </Link>
    ),
    // render: (value) => <p>{formatDate(value)}</p>,
  },
  {
    value: 'tx_count',
    name: 'Transactions',
    render: (value, data: BlockData) => (
      <Link to={`/explorer/block/${data.id}`}>
        <p className='text-[#FFFFFF]'>{value}</p>
      </Link>
    ),
  },
  {
    value: 'size',
    name: 'Size (KB)',
    render: (value, data: BlockData) => (
      <Link to={`/explorer/block/${data.id}`}>
        <p className='text-[#FFFFFF]'>{value}</p>
      </Link>
    ),
  },
  {
    value: 'weight',
    name: 'Weight (KWU)',
    render: (value, data: BlockData) => (
      <Link to={`/explorer/block/${data.id}`}>
        <p className='text-[#FFFFFF]'>{value}</p>
      </Link>
    ),
  },
];

export const TransactionConfig: Field<TransactionData>[] = [
  {
    value: 'txid',
    name: 'Transaction ID',
    render: (value) => (
      <>
        {/*53DCFF*/}
        <p className={'max-md:hidden text-[#FFFFFF]'}>{value}</p>
        <p className={'md:hidden text-[#FFFFFF]'}>
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
    render: (value) => <p>{'0x' + value.toString(16)}</p>,
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
    render: (value) => <p>{'0x' + value.toString(16)}</p>,
  },
  {
    value: 'difficulty',
    name: 'Difficulty',
  },
  {
    value: 'nonce',
    name: 'Nonce',
    render: (value) => <p>{'0x' + value.toString(16)}</p>,
  },
];

export const VinFields: Field<Vin>[] = [
  {
    value: 'scriptsig_asm',
    name: 'Scriptsig (asm)',
  },
  {
    value: 'scriptsig',
    name: 'Scriptsig (HEX)',
  },
  {
    value: 'sequence',
    name: 'Nsequence',
    render: (value) => <p>{'0x' + value.toString(16)}</p>,
  },
  {
    value: 'scriptpubkey_asm',
    name: 'PREVIOUS OUTPUT SCRIPT',
    render: (value, data) => (
      <p>
        {value} ({data.prevout.scriptpubkey_type})
      </p>
    ),
  },
  {
    value: 'scriptpubkey_address',
    name: 'PREVIOUS OUTPUT ADDRESS',
    render: (value) => <p className='text-[#53DCFF]'>{value}</p>,
  },
];

export const VoutFields: Field<Vout>[] = [
  {
    value: 'scriptpubkey_type',
    name: 'Type',
  },
  {
    value: 'scriptpubkey_asm',
    name: 'Scriptpubkey (ASM)',
  },
  {
    value: 'scriptpubkey',
    name: 'Scriptpubkey (HEX)',
  },
  {
    value: 'transaction',
    name: 'Spending Tx',
    render: (value, data: Vout) =>
      value && data?.transaction?.spent ? (
        <span>
          Spent by <span className='text-[#53DCFF]'>{data.transaction.txid}</span> in block{' '}
          <span className='text-[#53DCFF]'>
            {data.transaction.status.block_height
              ? `#${data.transaction.status.block_height}`
              : 'uncomfirmed'}
          </span>
        </span>
      ) : (
        <p>Unspent</p>
      ),
  },
];
