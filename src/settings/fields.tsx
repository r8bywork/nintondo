import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import CardTag from '../components/Card/CardTag/CardTag.tsx';
import {
  AddressStats,
  BlockData,
  TransactionData,
  Vin,
  Vout,
  Transaction,
  Collection,
} from '../interfaces/intefaces.ts';
import { InscriptionInfo } from '../interfaces/inscriptions.ts';
import { convertTimestampToFormattedDate, formatBytes, truncate } from '../utils';

export type Field<T extends object> = {
  [K in keyof T]: {
    name: string | ReactNode;
    value: K;
    render?: (value: T[K], data: T) => ReactNode;
  };
}[keyof T];

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
    value: 'owner',
    name: 'OWNED BY',
    render: (value) => (
      <>
        <span className={'text-[#53DCFF]'}>
          {truncate(value, {
            nPrefix: 7,
            nSuffix: 7,
          })}
        </span>
      </>
    ),
  },
  {
    value: 'file_type',
    name: 'FILE TYPE',
    render: (value, data) => (
      <>
        <span className={'text-[#4b4b4b] items-center flex'}>
          <CardTag
            text={value}
            active
            classNames={'leading-[23px]'}
          />
          {data.mime}
        </span>
      </>
    ),
  },
  {
    value: 'file_size',
    name: 'FILE SIZE',
    render: (value) => (
      <span className={'text-[#4b4b4b] items-center flex'}>{formatBytes(value)}</span>
    ),
  },
  {
    value: 'created',
    name: 'CREATED',
    render: (value) => (
      <>
        <span className={'text-[#53DCFF]'}>{convertTimestampToFormattedDate(value)}</span>
      </>
    ),
  },
  {
    value: 'creation_block',
    name: 'CREATION BLOCK',
    render: (value) => (
      <>
        <span className={'text-[#53DCFF]'}>{value}</span>
      </>
    ),
  },
  {
    value: 'creation_transaction',
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
];

export const collectionsFieldsTable: Field<Collection>[] = [
  {
    value: 'collection',
    name: 'COLLECTION',
    render: (value, data) => (
      <span className={'flex items-center'}>
        <img
          src={data.image}
          alt={'logo'}
          className={'w-[27px] h-[27px] mr-[13px]'}
        />
        {value.toLocaleString()}
      </span>
    ),
  },
  {
    value: 'supply',
    name: 'SUPPLY',
    render: (value) => <span>{value.toLocaleString()}</span>,
  },
  {
    value: 'fileSize',
    name: 'FILE SIZE',
    render: (value) => (
      <span>
        {value.toLocaleString()} <span className={'text-[#4B4B4B]'}>GB</span>
      </span>
    ),
  },
  {
    value: 'avgFileSize',
    name: 'AVG FILE SIZE',
    render: (value) => (
      <span>
        {value.toLocaleString()} <span className={'text-[#4B4B4B]'}>KB</span>
      </span>
    ),
  },
  {
    value: 'creationFee',
    name: 'CREATION FEE',
    render: (value) => (
      <span>
        {value.toLocaleString()} <span className={'text-[#4B4B4B]'}>BTC</span>
      </span>
    ),
  },
  {
    value: 'range',
    name: 'RANGE',
    render: (value) => (
      <span>
        {value[0].toLocaleString()} - {value[1].toLocaleString()}
      </span>
    ),
  },
  {
    value: 'creationDate',
    name: 'CREATION DATE',
  },
];
