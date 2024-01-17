import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TxApiResponse, txFields } from '../settings/fields';
import Skeleton from './components/Skeleton/Skeleton';
import Table from './components/Table/Table';

const TxPage = () => {
  const [tx, setTx] = useState<TxApiResponse[]>();

  const getTx = async (tx: string) => {
    const response = await axios.get(`https://bells.quark.blue/api/tx/${tx}`);
    const responseData: TxApiResponse[] = [
      {
        fee: response.data.fee,
        txid: response.data.txid,
        locktime: response.data.locktime,
        size: response.data.size,
        version: response.data.version,
      },
    ];
    return responseData;
  };
  const { hash } = useParams();

  useEffect(() => {
    hash && getTx(hash).then((res) => setTx(res));
  }, [hash]);

  return (
    <>
      {tx ? (
        <Table
          data={tx}
          fields={txFields}
          title='Latest Transactions'
        />
      ) : (
        <Skeleton />
      )}
    </>
  );
};
export default TxPage;
