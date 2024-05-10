import Table from './Table.tsx';
import { BlockConfig, TransactionConfig } from '../../settings/fields.tsx';
import Skeleton from '../Placeholders/Skeleton.tsx';
import { TableData } from '../../interfaces/intefaces.ts';
interface SwitchProps {
  activeTab: string;
  tableData: TableData;
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

export default SwitchTables;
