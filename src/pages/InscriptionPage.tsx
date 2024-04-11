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
import { useEffect, useState } from 'react';
import { InscriptionInfo, InscriptionOwner } from '../interfaces/inscriptions.ts';
import NewIcon from '../assets/card/fullsize.svg?react';
import UploadIcon from '../assets/card/share.svg?react';
import { MARKET_API_URL } from '../consts';
import { truncate } from '../utils';

const InscriptionPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InscriptionInfo[]>([]);
  const [owner, setOwner] = useState<InscriptionOwner[]>([]);
  const [image, setImage] = useState<string>('');
  const [type, setType] = useState<string>();
  const getInscriptionInfo = useExplorerGetInscriptionInfo();
  const getInscriptionOwner = useExplorerGetInscriptionOwner();
  useEffect(() => {
    if (hash) {
      Promise.all([getInscriptionInfo(hash), getInscriptionOwner(hash)]).then(
        ([reqData, reqOwner]) => {
          if (reqData !== null) {
            setData([reqData] as InscriptionInfo[]);
            setOwner([reqOwner] as InscriptionOwner[]);
          }
        },
      );
      fetch(`${MARKET_API_URL}/pub/content/${hash}`)
        .then((response) => {
          const contentType = response.headers.get('content-type');
          if (
            contentType &&
            (contentType.includes('text') || contentType.includes('application/'))
          ) {
            return response.text().then((json) => {
              setType('text');
              setImage(json);
            });
          } else if (contentType && contentType.includes('image/')) {
            return response.blob().then((blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64Data = reader.result as string;
                setType('image');
                setImage(base64Data);
              };
              reader.readAsDataURL(blob);
            });
          } else if (contentType && contentType.includes('model')) {
            return response.text().then((json) => {
              setType('text');
              setImage(json);
            });
          }
        })
        .catch((error) => console.error('Ошибка загрузки данных изображения:', error));
    }
  }, [hash]);

  return (
    <div className={'bg-black min-h-screen px-[10px] text-white'}>
      <div className={'pt-[150px] max-w-[1219px] flex max-lg:flex-col mx-auto w-full'}>
        <div className={'flex flex-col max-w-[500px] w-full mr-[55px]'}>
          <div className={'flex mb-[22px]'}>
            <button
              className='bg-[#FFFFFF] px-[20px] mr-[13px] rounded-[17px]'
              onClick={() => navigate('/marketplace/inscriptions')}
            >
              <LeftArrow />
            </button>
            <Search placeholder={'Search'} />
          </div>
          {image && data[0] && type && owner[0] && (
            <Card
              text={data[0].number}
              owner={truncate(owner[0].owner, {
                nPrefix: 7,
                nSuffix: 7,
              })}
              tags={[
                { tagText: data[0].file_type, active: true },
                { SvgIcon: NewIcon },
                { SvgIcon: UploadIcon },
              ]}
              image={image}
              contentType={type}
              BigCard
              onLoadHandler={() => {}}
              blurImage={false}
            />
          )}
        </div>

        <div className={'w-full'}>
          <div className={'max-lg:mt-[29px]'}>
            <Title text={'Inscription Info'} />
          </div>
          <div className={'mt-[25px]'}>
            {data[0] && owner[0] && (
              <Table
                data={[{ ...data[0], ...owner[0] }] as InscriptionInfo[]}
                fields={InscriptionInfoFields}
                marketplace
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InscriptionPage;
