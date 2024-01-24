import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import { AddressFields, AddressStats, Transaction } from '../settings/fields';
import InfoBlock from './components/InfoBlock/InfoBlock';
import Skeleton from './components/Skeleton/Skeleton';
import Table from './components/Table/Table';
import Transactions from './components/Transactions/Transactions.tsx';

const AddressPage = () => {
  const [tx, setTx] = useState<AddressStats[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBlock = async (hash: string) => {
    const response = await axios.get(`https://bells.quark.blue/api/address/${hash}`);
    return [response.data];
  };
  const getTxs = async (hash: string) => {
    const txs = await axios.get(`https://bells.quark.blue/api/address/${hash}/txs`);
    return [...txs.data];
  };

  const { hash } = useParams();

  useEffect(() => {
    if (hash) {
      setIsLoading(true);
      Promise.all([getBlock(hash), getTxs(hash)])
        .then(([txRes, txs]) => {
          setTx(txRes);
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
          <InfoBlock
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
