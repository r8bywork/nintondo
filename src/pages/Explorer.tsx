import axios from 'axios';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { BlockConfig, BlockData, TransactionConfig, TransactionData } from '../settings/fields';
import Search from './components/Search/Search';
import Skeleton from './components/Skeleton/Skeleton';
import TabSelect from './components/TabSelect/TabSelect';
import Table from './components/Table/Table';
import s from './styles.module.scss';
interface tableData {
  latestBlock: BlockData[];
  latestTransactions: TransactionData[];
}

interface SwitchProps {
  activeTab: string;
  tableData: tableData;
  setActiveTab: (tab: string) => void;
  onHandleSizeBlockChange: (height: number) => Promise<void>;
  isLoading: boolean;
}

const SwitchTables = ({
  activeTab,
  tableData,
  setActiveTab,
  onHandleSizeBlockChange,
  isLoading,
}: SwitchProps) => {
  switch (activeTab) {
    case 'dashboard':
      return (
        <div>
          <div className='pb-[60px]'>
            <Table
              data={tableData?.latestBlock.slice(0, 5)}
              fields={BlockConfig}
              title='Latest Blocks'
            />
            <button
              className='text-[#53DCFF] font-bold text-[14px] float-right'
              onClick={() => setActiveTab('blocks')}
            >
              View more blocks &#8594;
            </button>
          </div>
          <div className='pb-[60px]'>
            <Table
              data={tableData?.latestTransactions.slice(0, 5)}
              fields={TransactionConfig}
              title='Latest Transactions'
            />
            <button
              className='text-[#53DCFF] font-bold text-[14px] float-right'
              onClick={() => setActiveTab('transactions')}
            >
              View more transactions &#8594;
            </button>
          </div>
        </div>
      );

    case 'blocks':
      return (
        <div className='flex flex-col items-center'>
          {!isLoading ? (
            <Table
              data={tableData?.latestBlock}
              fields={BlockConfig}
              title='Latest Blocks'
            />
          ) : (
            <Skeleton />
          )}
          <div className='flex]'>
            <button
              className='text-[#53DCFF] font-bold text-[14px] mr-[10px]'
              onClick={() => onHandleSizeBlockChange(tableData.latestBlock[length].height + 10)}
            >
              &#8592; Prev
            </button>
            <button
              className='text-[#53DCFF] font-bold text-[14px]'
              onClick={() => onHandleSizeBlockChange(tableData.latestBlock[length].height - 10)}
            >
              Next &#8594;
            </button>
          </div>
        </div>
      );

    case 'transactions':
      return (
        <Table
          data={tableData?.latestTransactions}
          fields={TransactionConfig}
          title='Latest Transactions'
          className='pb-[150px]'
        />
      );

    default:
      return <p>Loading...</p>;
  }
};

const TabSelectFields = [
  {
    value: 'dashboard',
    title: 'bashboard',
  },
  {
    value: 'blocks',
    title: 'blocks',
  },
  {
    value: 'transactions',
    title: 'transactions',
  },
];
const Explorer = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [tableData, setTableData] = useState<tableData>();
  const [loading, setLoading] = useState<boolean>(false);

  const onHandleChange = (id: string) => {
    setActiveTab(id);
  };

  const getLatestTransactions = async () => {
    setLoading(true);
    const response = await axios.get('https://bells.quark.blue/api/mempool/recent');
    setLoading(false);
    return response.data;
  };

  const getLatestBlock = async (height?: number | null) => {
    setLoading(true);
    const response = await axios.get(`https://bells.quark.blue/api/blocks/${height ?? ''}`);
    setLoading(false);
    return response.data;
  };

  useEffect(() => {
    Promise.all([getLatestBlock(), getLatestTransactions()]).then((res) =>
      setTableData({ latestBlock: res[0], latestTransactions: res[1] }),
    );
  }, []);

  const onHandleSizeBlockChange = async (height: number) => {
    getLatestBlock(height).then((res) =>
      setTableData({
        latestTransactions: tableData!.latestTransactions,
        latestBlock: res,
      }),
    );
  };

  return (
    <div className={classNames(s.explorer, 'pt-[180px] max-md:pt-[100px]')}>
      {/* <div className='pb-[200px]'>
        <Header />
      </div> */}
      <div className='max-w-[1000px] mx-auto'>
        <div className='mb-[70px] flex w-full max-md:flex-col items-center justify-between'>
          <TabSelect
            fields={TabSelectFields}
            activeTab={activeTab}
            onHandleChange={onHandleChange}
          />
          <Search />
        </div>
        <div className='text-white max-w-[1080px]'>
          {tableData?.latestBlock && tableData?.latestTransactions ? (
            <SwitchTables
              activeTab={activeTab}
              tableData={tableData}
              setActiveTab={setActiveTab}
              onHandleSizeBlockChange={onHandleSizeBlockChange}
              isLoading={loading}
            />
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
