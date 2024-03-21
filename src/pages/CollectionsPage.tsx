import FoundCounter from '../components/FoundCounter.tsx';

const CollectionsPage = () => {
  return (
    <div className={'pt-[150px] max-lg:pt-[100px] bg-black min-h-screen text-white'}>
      <div>
        <FoundCounter
          count={10000}
          customText={'collections'}
        />
      </div>
    </div>
  );
};
export default CollectionsPage;
