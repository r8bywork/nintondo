import Link from '../Link/Link';

const links = [
  { name: 'bells', url: '/bells' },
  { name: 'wallet', url: '/wallet' },
  { name: 'markets', url: '/markets' },
  { name: 'explorer', url: '/explorer' },
];

const Header = () => {
  return (
    <div className={'flex justify-between px-24 py-14 bg-gradient-to-b from-black to-transparent'}>
      <div>
        <Link
          href='/'
          text='NINTONDO.IO'
          className={
            'text-yellow-500 text-2xl font-bold leading-normal font-inconsolata text-shadow-md'
          }
        />
      </div>
      <div className={'flex'}>
        {links.map((link) => (
          <Link
            key={link.name}
            text={link.name}
            href={link.url}
            className={'[&:not(:last-child)]:mr-28 text-white'}
          />
        ))}
      </div>
    </div>
  );
};

export default Header;
