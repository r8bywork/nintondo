import axios from 'axios';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BlockConfig, TransactionConfig } from '../settings/fields';
import BlockPage from './BlockPage';
import Search from './components/Search/Search';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import TabSelect from '../components/Controls/TabSelect.tsx';
import Table from '../components/Table/Table';
import s from './styles/styles.module.scss';
import TxPage from './TxPage.tsx';
import AddressPage from './AddressPage.tsx';
import { BlockData, TransactionData } from '../interfaces/intefaces.ts';

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
  isMobile: boolean;
}

const SwitchTables = ({
  activeTab,
  tableData,
  setActiveTab,
  onHandleSizeBlockChange,
  isLoading,
  isMobile,
}: SwitchProps) => {
  switch (activeTab) {
    case 'dashboard':
      return (
        <div>
          <div className='pb-[60px]'>
            <Table
              data={tableData?.latestBlock.slice(0, isMobile ? 2 : 5)}
              fields={BlockConfig}
              title='Latest Blocks'
              onClick={() => setActiveTab('blocks')}
            />
            <button
              className='text-[#FFFFF] px-[5px] bg-black/50 backdrop-blur-[15px] rounded-md font-bold text-[18px] float-right'
              onClick={() => setActiveTab('blocks')}
            >
              View more blocks &#8594;
            </button>
          </div>
          <div className='pb-[50px]'>
            <Table
              data={tableData?.latestTransactions.slice(0, isMobile ? 2 : 5)}
              fields={TransactionConfig}
              title='Latest Transactions'
              onClick={() => setActiveTab('transactions')}
            />
            <button
              className='text-[#FFFFF] px-[5px] bg-black/50 backdrop-blur-[15px] rounded-md font-bold text-[18px] float-right'
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
          <div className='flex'>
            <button
              style={{ background: 'linear-gradient(90deg, #FFF 0%, #FB0 99.07%)' }}
              className={
                'px-10 max-md:px-5 rounded-[17px] text-[20px] font-bold text-black mb-[15px]'
              }
              onClick={() =>
                onHandleSizeBlockChange(
                  tableData.latestBlock[tableData.latestBlock.length - 1].height - 1,
                )
              }
            >
              {'Load more'.toUpperCase()}
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
          className='pb-[50px]'
        />
      );

    default:
      return <p>Loading...</p>;
  }
};

const TabSelectFields = [
  {
    value: 'dashboard',
    title: 'dashboard',
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
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onHandleChange = (id: string) => {
    setActiveTab(id);
    navigate('/explorer');
  };

  const getLatestTransactions = async () => {
    const response = await axios.get('https://bells.quark.blue/api/mempool/recent');
    return response.data;
  };

  const getLatestBlock = async (height?: number | null) => {
    const response = await axios.get(`https://bells.quark.blue/api/blocks/${height ?? ''}`);
    return response.data;
  };

  useEffect(() => {
    if (location.pathname === '/explorer') {
      setLoading(true);
      Promise.all([getLatestBlock(), getLatestTransactions()]).then((res) =>
        setTableData({ latestBlock: res[0], latestTransactions: res[1] }),
      );
      setLoading(false);
    }
  }, [location.pathname]);

  const onHandleSizeBlockChange = async (height: number) => {
    getLatestBlock(height).then((res) => {
      setTableData((prevData) => ({
        latestTransactions: prevData!.latestTransactions,
        latestBlock: [...prevData!.latestBlock, ...res],
      }));
    });
  };

  return (
    <div className={classNames(s.explorer, 'pt-[180px] max-md:pt-[100px] px-[5px]')}>
      <div className='max-w-[1000px] mx-auto'>
        <div className='pb-[70px] max-md:pb-[32px] flex w-full max-md:flex-col-reverse items-center justify-between'>
          <TabSelect
            fields={TabSelectFields}
            activeTab={activeTab}
            onHandleChange={onHandleChange}
          />
          <Search />
        </div>
        <div className='text-white max-w-[1080px]'>
          <Routes>
            <Route
              path='/block/:hash'
              element={<BlockPage />}
            />
            <Route
              path='/tx/:hash'
              element={<TxPage />}
            />
            <Route
              path='/address/:hash'
              element={<AddressPage />}
            />
            <Route
              path='/'
              element={
                tableData?.latestBlock && tableData?.latestTransactions ? (
                  <SwitchTables
                    activeTab={activeTab}
                    tableData={tableData}
                    setActiveTab={setActiveTab}
                    onHandleSizeBlockChange={onHandleSizeBlockChange}
                    isLoading={loading}
                    isMobile={isMobile}
                  />
                ) : (
                  <Skeleton />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
