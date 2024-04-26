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
    <div className={classNames('flex', className)}>
      {fields.map((item, idx) => {
        return (
          <button
            style={
              activeTab === item.value
                ? {
                    background: 'var(--GRD, linear-gradient(90deg, #FFF 0%, #FB0 99.07%))',
                    boxShadow: '0px 1px 18.2px 0px #FFD45C80',
                  }
                : {}
            }
            className={classNames(
              'px-5 max-md:px-3 rounded-[30px] text-[20px] font-bold text-black max-md:mt-[10px]',
              {
                'bg-white': activeTab !== item.value,
                'md:mr-[12px] max-md:mr-[5px]': idx !== fields.length - 1,
              },
              buttonClassName,
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
