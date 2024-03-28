import { useNavigate, useParams } from 'react-router-dom';
import LeftArrow from '../assets/arrowleft.svg?react';
import Search from './components/Search/Search.tsx';
import Title from '../components/Title.tsx';
import Card from '../components/Card/Card.tsx';
import Table from '../components/Table/Table.tsx';
import { InscriptionInfoFields } from '../settings/fields.tsx';
import { useExplorerGetInscriptionInfo } from '../hooks/marketinfo.ts';
import { useEffect, useState } from 'react';
import { InscriptionInfo } from '../interfaces/inscriptions.ts';

const InscriptionPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InscriptionInfo[]>([]);
  const [image, setImage] = useState<string>('');
  const [type, setType] = useState<string>();
  const getInscriptionInfo = useExplorerGetInscriptionInfo();
  useEffect(() => {
    if (hash) {
      Promise.all([getInscriptionInfo(hash)]).then(([reqData]) => {
        if (reqData !== null) {
          setData([reqData] as InscriptionInfo[]);
        }
      });
      fetch(`http://0.0.0.0:8111/pub/content/${hash}`)
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
          {image && data[0] && type && (
            <Card
              text={data[0].number}
              date={data[0].created}
              tags={[{ tagText: data[0].file_type, active: true }]}
              image={image}
              contentType={type}
              BigCard
            />
          )}
        </div>

        <div className={'w-full'}>
          <div className={'max-lg:mt-[29px]'}>
            <Title text={'Inscription Info'} />
          </div>
          <div className={'mt-[25px]'}>
            {data && (
              <Table
                data={data}
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
