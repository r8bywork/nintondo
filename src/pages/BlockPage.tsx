import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CubeSvg from '../assets/Cube.svg?react';
import { AdditionalBlockFields, BlockData } from '../settings/fields';
import InfoBlock from './components/InfoBlock/InfoBlock';
import Skeleton from './components/Skeleton/Skeleton';
import Table from './components/Table/Table';

const BlockPage = () => {
  const [block, setBlock] = useState<BlockData[]>();

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
    hash && getBlock(hash).then((res) => setBlock(res));
  }, [hash]);

  return (
    <>
      {block ? (
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
        <Skeleton />
      )}
    </>
  );
};
export default BlockPage;
