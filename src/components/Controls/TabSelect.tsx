import classNames from 'classnames';

interface TabSelectProps {
  fields: {
    value: string;
    title: string;
  }[];
  onHandleChange: (id: string) => void;
  activeTab: string;
  className?: string;
  buttonClassName?: string;
}
const TabSelect = ({
  fields,
  onHandleChange,
  activeTab,
  className,
  buttonClassName,
}: TabSelectProps) => {
  return (
    <div className={classNames('flex gap-[12px]', className)}>
      {fields.map((item) => {
        return (
          <button
            style={
              activeTab === item.value
                ? {
                    background: '',
                    boxShadow: '0px 1px 18.2px 0px #FFD45C80',
                  }
                : {
                    backgroundPosition: '-100%',
                  }
            }
            className={classNames(
              'px-5 bg-white z-[2] max-md:px-3 rounded-[30px] text-[20px] font-bold text-black max-md:mt-[10px] tab-animated overflow-hidden transition duration-300',
              {
                'tab-animated-active': activeTab === item.value,
              },
              buttonClassName,
            )}
            key={item.value}
            onClick={() => onHandleChange(item.value)}
          >
            <p className='z-[3] relative'>{item.title.toUpperCase()}</p>
          </button>
        );
      })}
    </div>
  );
};
export default TabSelect;
