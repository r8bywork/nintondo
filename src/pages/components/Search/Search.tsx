import { FC } from 'react';
import ButtonSvg from '../../../assets/Button.svg?react';
const searchAction = (value: FormData) => {
  console.log(value);
};

const Search: FC = () => {
  return (
    <form
      className='flex gap-4 items-center w-full max-w-3xl '
      onSubmit={searchAction}
    >
      <input
        name={'query'}
        className='w-full rounded-full py-2 bg-black/25 border-2 text-white placeholder-slate-500 px-5 outline-none focus:border-orange-500 transition-colors'
        placeholder='Search for blocks height, hash, transactions, or address.'
        type='text'
      />
      <button
        type='submit'
        className='flex'
      >
        <ButtonSvg className='flex' />
      </button>
    </form>
  );
};

export default Search;
