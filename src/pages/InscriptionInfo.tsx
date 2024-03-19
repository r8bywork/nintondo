import { useNavigate, useParams } from 'react-router-dom';
import LeftArrow from '../assets/arrowleft.svg?react';
import Search from './components/Search/Search.tsx';
import Title from '../components/Title.tsx';
import Card from '../components/Card/Card.tsx';
import { inscriptionCard, inscriptionInfo } from '../settings/settings.ts';
import Table from '../components/Table/Table.tsx';
import { InscriptionInfoFields } from '../settings/fields.tsx';

const InscriptionInfo = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  console.log(hash);
  return (
    <div className={'bg-black min-h-screen px-[10px]'}>
      <div className={'pt-[150px] max-w-[1219px] flex max-lg:flex-col mx-auto w-full'}>
        <div className={'flex flex-col max-w-[500px] w-full mr-[55px]'}>
          <div className={'flex mb-[22px]'}>
            <button
              className='bg-[#FFFFFF] px-[20px] mr-[13px] rounded-[17px]'
              onClick={() => navigate('/marketplace')}
            >
              <LeftArrow />
            </button>
            <Search placeholder={'Search'} />
          </div>
          <Card
            text={'63,294,117'}
            tags={inscriptionCard[0].tags}
            image={inscriptionCard[0].image}
            BigCard
          />
        </div>

        <div className={'w-full'}>
          <div className={'max-lg:mt-[29px]'}>
            <Title text={'Inscription Info'} />
          </div>
          <div className={'mt-[25px]'}>
            <Table
              data={inscriptionInfo}
              fields={InscriptionInfoFields}
              marketplace
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default InscriptionInfo;
