import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import LeftArrow from '../assets/arrowleft.svg?react';
import RightArrow from '../assets/arrowright.svg?react';
import { AdditionalBlockFields, BlockData } from '../settings/fields';
import InfoBlock from './components/InfoBlock/InfoBlock';
import Skeleton from './components/Skeleton/Skeleton';
import Table from './components/Table/Table';

const BlockPage = () => {
  const [block, setBlock] = useState<BlockData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getBlock = async (block: string) => {
    const response = await axios.get(`https://bells.quark.blue/api/block/${block}`);
    const blockStatus = await axios.get(`https://bells.quark.blue/api/block/${block}/status`);
    const combinedData = {
      ...response.data,
      ...blockStatus.data,
    };
    return [combinedData];
  };
  const { hash } = useParams();

  useEffect(() => {
    setIsLoading(true);
    hash &&
      getBlock(hash)
        .then((res) => setBlock(res))
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
      <div className='flex justify-between mt-[15px]'>
        <button
          className='bg-[#FFBB00] px-[20px] rounded-[17px]'
          onClick={handlePrevBlock}
        >
          <LeftArrow />
        </button>

        {block && block[0].next_best !== null && (
          <button
            className='bg-[#FFBB00] px-[20px] rounded-[17px]'
            onClick={handleNextBlock}
          >
            <RightArrow />
          </button>
        )}
      </div>
    </>
  );
};
export default BlockPage;
