import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import LeftArrow from '../assets/arrowleft.svg?react';
import RightArrow from '../assets/arrowright.svg?react';
import { AdditionalBlockFields, BlockData, Transaction } from '../settings/fields';
import InfoBlock from './components/InfoBlock/InfoBlock';
import Skeleton from './components/Skeleton/Skeleton';
import Table from './components/Table/Table';
import Transactions from './components/Transactions/Transactions';

const TxPage = () => {
  const [block, setBlock] = useState<BlockData[]>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transLoading, setTransLoading] = useState<boolean>(false);
  const [lastBlock, setLastBlock] = useState<number>(0);
  const navigate = useNavigate();

  const getBlock = async (block: string) => {
    const response = await axios.get(`https://bells.quark.blue/api/block/${block}`);
    const blockStatus = await axios.get(`https://bells.quark.blue/api/block/${block}/status`);
    return [{ ...response.data, ...blockStatus.data }];
  };

  const getTransactions = async (block: string, length?: number) => {
    const response = await axios.get(
      `https://bells.quark.blue/api/block/${block}/txs/${length || 0}`,
    );
    return response.data;
  };

  const getHeightBlock = async () => {
    const response = await axios.get('https://bells.quark.blue/api/blocks/tip/height');
    return response.data;
  };

  const { hash } = useParams();

  useEffect(() => {
    if (hash) {
      setIsLoading(true);
      setTransLoading(true);
      Promise.all([getBlock(hash), getTransactions(hash), getHeightBlock()])
        .then(([blockRes, transactionsRes, height]) => {
          setBlock(blockRes);
          setTransactions(transactionsRes);
          setLastBlock(height);
        })
        .finally(() => {
          setIsLoading(false);
          setTransLoading(false);
        });
    }
  }, [hash]);

  const loadMore = async () => {
    if (hash && transactions) {
      const newTransactions = await getTransactions(hash, transactions.length + 25);
      setTransactions((prevTransactions) => [...prevTransactions, ...newTransactions]);
    }
  };

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
          onClick={() => {
            block && navigate(`/explorer/block/${block[0].previousblockhash}`);
          }}
        >
          <LeftArrow />
        </button>

        {block?.[0]?.next_best && (
          <button
            className='bg-[#FFBB00] px-[20px] rounded-[17px]'
            onClick={() => {
              block && navigate(`/explorer/block/${block[0].next_best}`);
            }}
          >
            <RightArrow />
          </button>
        )}
      </div>
      {transactions && !transLoading ? (
        <>
          <Transactions
            data={transactions}
            height={lastBlock}
          />
          <div className={'pb-[20px]  flex justify-center'}>
            <button
              onClick={() => loadMore()}
              className={'px-[25px] rounded-[17px] text-[20px] bg-[#FB0] text-black font-bold'}
              style={{ background: 'linear-gradient(90deg, #FFF 0%, #FB0 99.07%)' }}
            >
              Load more
            </button>
          </div>
        </>
      ) : (
        <Skeleton classNames='h-[200px] mb-[50px]' />
      )}
    </>
  );
};
export default TxPage;
