import cn from 'classnames';

interface CollectionDetailsProps {
  title: string;
  value: number | number[];
  additionalSymbol?: string;
  classNames?: string;
}
const CollectionDetails = ({
  title,
  value,
  additionalSymbol,
  classNames,
}: CollectionDetailsProps) => {
  const renderValue = () => {
    if (
      Array.isArray(value) &&
      value.length === 2 &&
      typeof value[0] === 'number' &&
      typeof value[1] === 'number'
    ) {
      return `${value[0].toLocaleString()} - ${value[1].toLocaleString()}`;
    } else {
      return value;
    }
  };
  return (
    <div
      className={cn(
        classNames,
        'rounded-[50px] min-w-[362px] bg-[#191919] px-[28px] py-[8px] flex justify-between leading-[20px] text-[20px]',
      )}
    >
      <span className={'text-[#4B4B4B]'}>{title}</span>
      <div>
        <span className={cn({ ['mr-[5px]']: additionalSymbol })}>{renderValue()}</span>
        <span className={'text-[#4B4B4B] text-[15px]'}>{additionalSymbol}</span>
      </div>
    </div>
  );
};
export default CollectionDetails;
