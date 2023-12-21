import Column from './Column.tsx';
import './Footer.css';
const Footer = () => {
  const footerContent = [
    {
      title: 'LEARN',
      items: ['Docs', 'White Paper', 'Roadmap', 'Blockchain Explorer'],
    },
    {
      title: 'CONNECT',
      items: ['GitHub', 'Community', 'News', 'Partners'],
    },
    {
      title: 'ABOUT',
      items: ['Press', 'Brand Assets', 'Mining'],
    },
    {
      title: 'DOWNLOADS',
      items: ['Mac OSX', 'Windows 64-bit', 'Linux 64-bit', 'Android (BETA)'],
    },
  ];

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
