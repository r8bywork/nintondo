import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import { Transaction, TxFieldsTable } from '../settings/fields';
import InfoBlock from '../components/InfoBlock/InfoBlock';
import Skeleton from '../components/Skeleton/Skeleton';
import Table from '../components/Table/Table';
import Transactions from '../components/Transactions/Transactions.tsx';

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
          <InfoBlock
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
