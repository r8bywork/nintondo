import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { truncate } from './utils';
import CardTag from '../components/Card/CardTag/CardTag.tsx';

export type Field<T extends object> = {
  [K in keyof T]: {
    name: string | ReactNode;
    value: K;
    render?: (value: T[K], data: T) => ReactNode;
  };
}[keyof T];

export interface AddressStats {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
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
  vsize: number;
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

export interface InscriptionInfo {
  id: string;
  ownedBy: string;
  fileType: string;
  fileSize: string;
  created: string;
  creationBlock: number;
  creationTransaction: string;
  creationFeeSats: number;
  tags: string;
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
        <p className='text-[#FFFFFF]'>{value / 1000}</p>
      </Link>
    ),
  },
  {
    value: 'weight',
    name: 'Weight (KWU)',
    render: (value, data: BlockData) => (
      <Link to={`/explorer/block/${data.id}`}>
        <p className='text-[#FFFFFF]'>{value / 1000}</p>
      </Link>
    ),
  },
];

export const TransactionConfig: Field<TransactionData>[] = [
  {
    value: 'txid',
    name: 'Transaction ID',
    render: (value, data) => (
      <Link to={`/explorer/tx/${data.txid}`}>
        <p className={'max-md:hidden text-[#FFFFFF]'}>{value}</p>
        <p className={'md:hidden text-[#FFFFFF]'}>
          {truncate(value, {
            nPrefix: 4,
            nSuffix: 4,
          })}
        </p>
      </Link>
    ),
  },
  {
    value: 'value',
    name: 'Value',
    render: (value) => <p>{(value / 100000000).toFixed(3)} BEL</p>,
  },
  {
    value: 'fee',
    name: 'Fee',
    render: (value, data) => <p>{Math.ceil(value / data.vsize).toFixed(3)} sat/vB</p>,
  },
  {
    value: 'vsize',
    name: 'Size',
    render: (value) => <p>{value} vB</p>,
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

export const TxFieldsTable: Field<Transaction>[] = [
  {
    value: 'status',
    name: 'Status',
    render: (value) => <p>{value.confirmed ? 'Confirmed' : 'Unconfirmed'}</p>,
  },
  // {
  //   value: 'vsize',
  //   name: 'eta',
  // },
  {
    value: 'size',
    name: 'size',
    render: (value) => <p>{`${value} B`}</p>,
  },
  {
    value: 'size',
    name: 'virtual size',
    render: (value) => <p>{`${value} vB`}</p>,
  },
  {
    value: 'weight',
    name: 'weight units',
    render: (value) => <p>{`${value} WU`}</p>,
  },
  {
    value: 'version',
    name: 'Version',
  },
  {
    value: 'locktime',
    name: 'locktime',
  },
];

export const AddressFields: Field<AddressStats>[] = [
  {
    value: 'chain_stats',
    name: 'TOTAL TX COUNT',
    render: (value, data) => <p>{value.tx_count + data.mempool_stats.tx_count}</p>,
  },
  {
    value: 'chain_stats',
    name: 'conf. tx count',
    render: (value) => <p>{value.tx_count}</p>,
  },
  {
    value: 'chain_stats',
    name: 'conf. received',
    render: (value) => (
      <p>
        {value.funded_txo_count} outputs ({(value.funded_txo_sum / 100000000).toFixed(3)} BEL)
      </p>
    ),
  },
  {
    value: 'chain_stats',
    name: 'conf. spent',
    render: (value) => (
      <p>
        {value.spent_txo_count} outputs ({(value.spent_txo_sum / 100000000).toFixed(3)} BEL)
      </p>
    ),
  },
  {
    value: 'chain_stats',
    name: 'conf. unspent',
    render: (value) => (
      <p>
        {value.funded_txo_count - value.spent_txo_count} outputs (
        {((value.funded_txo_sum - value.spent_txo_sum) / 100000000).toFixed(3)} BEL)
      </p>
    ),
  },
  {
    value: 'mempool_stats',
    name: 'unconf. tx count',
    render: (value) => <p>{value.tx_count}</p>,
  },
  {
    value: 'mempool_stats',
    name: 'unconf. received',
    render: (value) => (
      <p>
        {value.funded_txo_count} outputs ({(value.funded_txo_sum / 100000000).toFixed(3)} BEL)
      </p>
    ),
  },
  {
    value: 'mempool_stats',
    name: 'unconf. spent',
    render: (value) => (
      <p>
        {value.spent_txo_count} outputs ({(value.spent_txo_sum / 100000000).toFixed(3)} BEL)
      </p>
    ),
  },
  {
    value: 'mempool_stats',
    name: 'total unspent',
    render: (value, data) => (
      <p>
        {data.chain_stats.funded_txo_count -
          data.chain_stats.spent_txo_count +
          (value.funded_txo_count - value.spent_txo_count)}{' '}
        outputs (
        {(
          (value.funded_txo_sum -
            value.spent_txo_sum +
            data.chain_stats.funded_txo_sum -
            data.chain_stats.spent_txo_sum) /
          100000000
        ).toFixed(3)}
        BEL)
      </p>
    ),
  },
];

export const InscriptionInfoFields: Field<InscriptionInfo>[] = [
  {
    value: 'id',
    name: 'ID',
    render: (value) => (
      <>
        <span className={'text-[#53DCFF]'}>
          {truncate(value, {
            nPrefix: 5,
            nSuffix: 5,
          })}
        </span>
      </>
    ),
  },
  {
    value: 'ownedBy',
    name: 'OWNED BY',
    render: (value) => (
      <>
        <span className={'text-[#53DCFF]'}>
          {truncate(value, {
            nPrefix: 5,
            nSuffix: 5,
          })}
        </span>
      </>
    ),
  },
  {
    value: 'fileType',
    name: 'FILE TYPE',
    render: (value) => (
      <>
        <span className={'text-[#4b4b4b] items-center flex'}>
          <CardTag
            text={value}
            active
            classNames={'leading-[23px]'}
          />
          image/webp
        </span>
      </>
    ),
  },
  {
    value: 'fileSize',
    name: 'FILE SIZE',
  },
  {
    value: 'created',
    name: 'CREATED',
  },
  {
    value: 'creationBlock',
    name: 'CREATION BLOCK',
    render: (value) => (
      <>
        <span className={'text-[#53DCFF]'}>{value.toLocaleString()}</span>
      </>
    ),
  },
  {
    value: 'creationTransaction',
    name: 'CREATION TRANSACTION',
    render: (value) => (
      <>
        <span className={'text-[#53DCFF]'}>
          {truncate(value, {
            nPrefix: 5,
            nSuffix: 5,
          })}
        </span>
      </>
    ),
  },
  {
    value: 'creationFeeSats',
    name: 'CREATION FEE (sats)',
    render: (value) => (
      <>
        <span>{value.toLocaleString()}</span>
      </>
    ),
  },
  {
    value: 'tags',
    name: 'TAGS',
  },
];
