import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftArrow from '../assets/arrowleft.svg?react';
import Search from './components/Search/Search.tsx';
import Title from '../components/Title.tsx';
import Card from '../components/Card/Card.tsx';
import Table from '../components/Table/Table.tsx';
import { InscriptionInfoFields } from '../settings/fields.tsx';
import {
  useExplorerGetInscriptionInfo,
  useExplorerGetInscriptionOwner,
} from '../hooks/marketinfo.ts';
import { InscriptionInfo, InscriptionOwner } from '../interfaces/inscriptions.ts';
import UploadIcon from '../assets/card/share.svg?react';
import { useInscriptionFilters } from '@/hooks/useInscriptionFilters.ts';
import { shareData } from '@/utils';

const InscriptionPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InscriptionInfo | undefined>(undefined);
  const [owner, setOwner] = useState<InscriptionOwner | undefined>(undefined);
  const getInscriptionInfo = useExplorerGetInscriptionInfo();
  const getInscriptionOwner = useExplorerGetInscriptionOwner();
  const { handleCreationBlockClick } = useInscriptionFilters();
  const functions = {
    handleCreationBlockClick,
  };
  useEffect(() => {
    if (hash) {
      Promise.all([getInscriptionInfo(hash), getInscriptionOwner(hash)]).then(
        ([reqData, reqOwner]) => {
          if (!reqData) return;
          setData(reqData as InscriptionInfo);
          setOwner({ owner: reqOwner?.owner ?? 'Not found' } as InscriptionOwner);
        },
      );
    }
  }, [hash]);

  return (
    <div className={'bg-black min-h-screen px-[10px] text-white'}>
      <div className={'pt-[150px] max-w-[1219px] flex max-lg:flex-col mx-auto w-full'}>
        <div className={'flex flex-col max-w-[500px] w-full mr-[55px]'}>
          <div className={'flex mb-[22px]'}>
            <button
              className='bg-[#FFFFFF] px-[20px] mr-[13px] rounded-[17px]'
              onClick={() => navigate(-1)}
            >
              <LeftArrow />
            </button>
            <Search placeholder={'Search'} />
          </div>
          {data && (
            <Card
              url={data?.id}
              contentType=''
              text={data?.number}
              tags={[
                { tagText: data?.file_type, active: true },
                { SvgIcon: UploadIcon, onClick: shareData },
              ]}
              date={data?.created}
              BigCard
              onLoadHandler={() => {}}
              blurImage={false}
            />
          )}
        </div>

        <div className={'w-full pb-[30px]'}>
          <div className={'max-lg:mt-[29px]'}>
            <Title text={'Inscription Info'} />
          </div>
          <div className={'mt-[25px]'}>
            {data && owner && (
              <Table
                data={[{ ...data, ...owner }] as InscriptionInfo[]}
                fields={InscriptionInfoFields}
                marketplace
                functions={functions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InscriptionPage;
