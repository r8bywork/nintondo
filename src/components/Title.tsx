interface Title {
  text: string;
}
const Title = ({ text }: Title) => {
  return (
    <div
      className={
        'w-fit rounded-[30px] px-[10px] py-[2px] text-black bg-white font-bold text-[24px] leading-[24px]'
      }
    >
      {text}
    </div>
  );
};
export default Title;
