import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import LeftArrow from '../assets/arrowleft.svg?react';
import RightArrow from '../assets/arrowright.svg?react';
import { AdditionalBlockFields } from '../settings/fields';
import HashCopyBlock from '../components/HashCopyBlock.tsx';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import Table from '../components/Table/Table';
import Transactions from '../components/Transactions/Transactions';
import { BlockData, Transaction } from '../interfaces/intefaces.ts';
import {
  useExplorerGetBlockById,
  useExplorerGetBlockHeight,
  useExplorerGetBlockStatus,
  useExplorerGetTransactions,
} from '../hooks/explorerapi.ts';

const BlockPage = () => {
  const [block, setBlock] = useState<BlockData[] | undefined>();
  const [transactions, setTransactions] = useState<Transaction[] | undefined>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transLoading, setTransLoading] = useState<boolean>(false);
  const [lastBlock, setLastBlock] = useState<number | undefined>(0);
  const navigate = useNavigate();
  const getTransactions = useExplorerGetTransactions();
  const getHeightBlock = useExplorerGetBlockHeight();
  const getBlockById = useExplorerGetBlockById();
  const getBlockStatus = useExplorerGetBlockStatus();
  const { hash } = useParams();

  useEffect(() => {
    if (hash) {
      setIsLoading(true);
      setTransLoading(true);
      Promise.all([
        getBlockStatus(hash),
        getBlockById(hash),
        getTransactions(hash),
        getHeightBlock(),
      ])
        .then(([blockRes, blockStatus, transactionsRes, height]) => {
          setBlock([{ ...blockRes, ...blockStatus }] as BlockData[]);
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
      setTransactions((prevTransactions) =>
        prevTransactions !== undefined && newTransactions !== undefined
          ? [...prevTransactions, ...newTransactions]
          : newTransactions,
      );
    }
  };

  return (
    <>
      {!isLoading && block ? (
        <>
          <HashCopyBlock
            hash={hash}
            title={`Block ${block[0].height}`}
            SvgIcon={CubeSvg}
          />
          <Table
            data={block}
            fields={AdditionalBlockFields}
            mode={'additional'}
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
export default BlockPage;
