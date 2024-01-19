import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import LeftArrow from '../assets/arrowleft.svg?react';
import RightArrow from '../assets/arrowright.svg?react';
import { AdditionalBlockFields, BlockData, Transaction } from '../settings/fields';
import InfoBlock from './components/InfoBlock/InfoBlock';
import Skeleton from './components/Skeleton/Skeleton';
import Table from './components/Table/Table';
import Transactions from './components/Transactions/Transactions';

const BlockPage = () => {
  const [block, setBlock] = useState<BlockData[]>();
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBlock = async (block: string) => {
    const response = await axios.get(`https://bells.quark.blue/api/block/${block}`);
    const blockStatus = await axios.get(`https://bells.quark.blue/api/block/${block}/status`);
    return [{ ...response.data, ...blockStatus.data }];
  };

  const getTransactions = async (block: string) => {
    const response = await axios.get(`https://bells.quark.blue/api/block/${block}/txs/0`);
    return response.data;
  };
  const { hash } = useParams();

  useEffect(() => {
    setIsLoading(true);
    hash &&
      getBlock(hash)
        .then((res) => setBlock(res))
        .finally(() => setIsLoading(false));
    hash &&
      getTransactions(hash)
        .then((res) => setTransactions(res))
        .finally(() => setIsLoading(false));
  }, [hash]);

  const handlePrevBlock = async () => {
    setIsLoading(true);
    block &&
      getBlock(block[0].previousblockhash)
        .then((res) => setBlock(res))
        .finally(() => setIsLoading(false));
  };

  const handleNextBlock = () => {
    setIsLoading(true);
    block &&
      getBlock(block[0].next_best)
        .then((res) => setBlock(res))
        .finally(() => setIsLoading(false));
  };

  // const LoadTransactions = () => {
  //   setIsLoading(true);
  //   block &&
  //     getBlock(block[0].next_best)
  //       .then((res) => setBlock(res))
  //       .finally(() => setIsLoading(false));
  // };

  return (
    <>
      {!isLoading && block ? (
        <>
          <InfoBlock
            hash={hash}
            title={`Block ${block[0].height}`}
            SvgIcon={CubeSvg}
          />
          <Table
            data={block}
            fields={AdditionalBlockFields}
            additional
          />
        </>
      ) : (
        <Skeleton classNames='h-[449px]' />
      )}
      <div className='flex justify-between my-[15px]'>
        <button
          className='bg-[#FFBB00] px-[20px] rounded-[17px]'
          onClick={handlePrevBlock}
        >
          <LeftArrow />
        </button>

        {block?.[0]?.next_best && (
          <button
            className='bg-[#FFBB00] px-[20px] rounded-[17px]'
            onClick={handleNextBlock}
          >
            <RightArrow />
          </button>
        )}
      </div>
      {transactions ? <Transactions data={transactions} /> : <Skeleton />}
    </>
  );
};
export default BlockPage;
