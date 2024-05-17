import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BlockPage from './BlockPage';
import Search from './components/Search/Search';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import TabSelect from '../components/Controls/TabSelect.tsx';
import s from './styles/styles.module.scss';
import TxPage from './TxPage.tsx';
import AddressPage from './AddressPage.tsx';
import {
  useExplorerGetLatestBlock,
  useExplorerGetLatestTransactions,
} from '../hooks/explorerapi.ts';
import { TabSelectFields } from '../settings/settings.ts';
import { TableData } from '../interfaces/intefaces.ts';
import SwitchTables from '../components/Table/SwitchTables.tsx';

const Explorer = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [tableData, setTableData] = useState<TableData>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const getLatestTransactions = useExplorerGetLatestTransactions();
  const getLatestBlock = useExplorerGetLatestBlock();
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

  useEffect(() => {
    if (location.pathname === '/explorer') {
      setLoading(true);
      Promise.all([getLatestBlock(), getLatestTransactions()]).then(
        ([latestBlock, latestTransactions]) => {
          if (latestBlock && latestTransactions !== undefined) {
            setTableData({ latestBlock: latestBlock, latestTransactions: latestTransactions });
          }
        },
      );
      setLoading(false);
    }
  }, [location.pathname]);

  const onHandleSizeBlockChange = async (height: number) => {
    // setLoading(true);
    getLatestBlock(height).then((res) => {
      if (res) {
        setTableData((prevData) => ({
          latestTransactions: prevData!.latestTransactions,
          latestBlock: [...prevData!.latestBlock, ...res],
        }));
      }
    });
    // .finally(() => setLoading(false));
  };

  return (
    <div className={classNames(s.explorer, 'pt-[180px] max-md:pt-[100px] px-[5px]')}>
      <div className='max-w-[1000px] mx-auto'>
        <div className='pb-[70px] max-md:pb-[32px] flex w-full max-md:flex-col-reverse items-center justify-between'>
          <TabSelect
            fields={TabSelectFields}
            activeTab={activeTab}
            onHandleChange={onHandleChange}
            className='mr-[12px]'
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
