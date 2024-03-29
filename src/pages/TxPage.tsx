import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import { TxFieldsTable } from '../settings/fields';
import HashCopyBlock from '../components/HashCopyBlock.tsx';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import Table from '../components/Table/Table';
import Transactions from '../components/Transactions/Transactions.tsx';
import { Transaction } from '../interfaces/intefaces.ts';
import { useExplorerTxInfo } from '../hooks/explorerapi.ts';

const TxPage = () => {
  const [tx, setTx] = useState<Transaction[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBlock = useExplorerTxInfo();
  const { hash } = useParams();

  useEffect(() => {
    if (hash) {
      getBlock(hash)
        .then((data) => {
          setTx(data);
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
            title={`Transaction ${tx[0].weight}`}
            SvgIcon={CubeSvg}
          />
          <Table
            data={tx}
            fields={TxFieldsTable}
            mode={'additional'}
          />
        </>
      ) : (
        <Skeleton classNames='h-[449px] mb-[50px]' />
      )}
      {tx && !isLoading ? (
        <Transactions data={tx} />
      ) : (
        <Skeleton classNames='h-[200px] mb-[50px]' />
      )}
    </>
  );
};
export default TxPage;
