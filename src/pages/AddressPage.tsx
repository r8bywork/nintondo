import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import { AddressFields } from '../settings/fields';
import HashCopyBlock from '../components/HashCopyBlock.tsx';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import Table from '../components/Table/Table';
import Transactions from '../components/Transactions/Transactions.tsx';
import { AddressStats, Transaction } from '../interfaces/intefaces.ts';
import { useExplorerGetBlock, useExplorerGetBlockTxs } from '../hooks/explorerapi.ts';

const AddressPage = () => {
  const [tx, setTx] = useState<AddressStats[] | undefined>([]);
  const [txs, setTxs] = useState<Transaction[] | undefined>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getBlock = useExplorerGetBlock();
  const getTxs = useExplorerGetBlockTxs();

  const { hash } = useParams();

  useEffect(() => {
    if (hash) {
      setIsLoading(true);
      Promise.all([getBlock(hash), getTxs(hash)])
        .then(([txRes, txs]) => {
          setTx([txRes] as AddressStats[]);
          setTxs(txs);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [hash]);

  return (
    <>
      {!isLoading && tx ? (
        <>
          <HashCopyBlock
            hash={hash}
            title={'Address'}
            SvgIcon={CubeSvg}
          />
          <Table
            data={tx}
            fields={AddressFields}
            additional
          />
        </>
      ) : (
        <Skeleton classNames='h-[449px] mb-[50px]' />
      )}
      {txs && !isLoading ? (
        <Transactions data={txs} />
      ) : (
        <Skeleton classNames='h-[200px] mb-[50px]' />
      )}
    </>
  );
};
export default AddressPage;
