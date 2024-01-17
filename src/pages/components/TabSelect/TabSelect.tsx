import classNames from 'classnames';

interface TabSelectProps {
  fields: {
    value: string;
    title: string;
  }[];
  onHandleChange: (id: string) => void;
  activeTab: string;
}
const TabSelect = ({ fields, onHandleChange, activeTab }: TabSelectProps) => {
  return (
    <div className={'flex max-[420px]:flex-col'}>
      {fields.map((item) => {
        return (
          <button
            style={
              activeTab === item.value
                ? { background: 'var(--GRD, linear-gradient(90deg, #FFF 0%, #FB0 99.07%))' }
                : {}
            }
            className={classNames(
              'px-5 md:mr-[12px] max-md:mr-[5px] rounded-[30px] text-[20px] font-bold text-black max-md:mb-[10px]',
              {
                'bg-white': activeTab !== item.value,
              },
            )}
            key={item.value}
            onClick={() => onHandleChange(item.value)}
          >
            {item.title.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};
export default TabSelect;
