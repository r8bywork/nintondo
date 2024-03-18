interface ColumnProps {
  title: string;
  items: { text: string; href: string }[];
}
const Column = ({ title, items }: ColumnProps) => (
  <div className='w-full md:w-1/4 p-4'>
    <h5 className='text-regal-yellow text-[20px] not-italic font-bold leading-[28px] mb-3'>
      {title}
    </h5>
    <ul className='list-none mb-0'>
      {items.map((item, index) => (
        <li
          key={index}
          className='text-white text-[12px] font-normal leading-[30px] mb-2 hover:text-gray-300'
        >
          <a
            href={item.href}
            className='no-underline'
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Column;
