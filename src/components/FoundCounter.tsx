interface FoundCounterProps {
  count: number;
  customText: string;
}
const FoundCounter = ({ count, customText }: FoundCounterProps) => {
  return (
    <span className={'text-[#4B4B4B] font-16px px-[15px]'}>
      Found <span className={'text-white'}>{Number(count).toLocaleString()}</span> {customText}
    </span>
  );
};

export default FoundCounter;
