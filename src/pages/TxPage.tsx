import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import { TxFieldsTable } from '../settings/fields';
import HashCopyBlock from '../components/HashCopyBlock.tsx';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import Table from '../components/Table/Table';
import Transactions from '../components/Transactions/Transactions.tsx';
import { Transaction } from '../interfaces/intefaces.ts';

const TxPage = () => {
  const [tx, setTx] = useState<Transaction[]>();
  // const [memPool, setMemPool] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBlock = async (hash: string) => {
    const memPool = await axios.get('https://bells.quark.blue/api/mempool');
    const feeEstimates = await axios.get('https://bells.quark.blue/api/fee-estimates');
    const response = await axios.get(`https://api.nintondo.io/api/tx/${hash}`);
    return [{ ...response.data, ...memPool.data, fee: { ...feeEstimates.data } }];
  };

  const { hash } = useParams();

  useEffect(() => {
    if (hash) {
      setIsLoading(true);
      Promise.all([getBlock(hash)])
        .then(([txRes]) => {
          setTx(txRes);
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
            additional
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
