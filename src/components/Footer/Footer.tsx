import Column from './Column.tsx';
import './Footer.css';
import { footerContent } from '../../settings/settings.ts';
const Footer = () => {
  return (
    <div className={'Footer'}>
      <div className='container py-8'>
        <div className='flex flex-wrap'>
          {footerContent.map((column, index) => (
            <Column
              key={index}
              title={column.title}
              items={column.items}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
