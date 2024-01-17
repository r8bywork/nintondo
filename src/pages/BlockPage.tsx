import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdditionalBlockFields, BlockData } from '../settings/fields';
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
        <Table
          data={block}
          fields={AdditionalBlockFields}
        />
      ) : (
        <Skeleton />
      )}
    </>
  );
};
export default BlockPage;
