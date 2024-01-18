import axios from 'axios';
import { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSvg from '../../../assets/Button.svg?react';

const Search: FC = () => {
  const navigate = useNavigate();

  const searchAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query')?.toString().trim();

    if (query) {
      const isTxHash = /^[0-9a-fA-F]{64}$/.test(query);

      if (!isTxHash) {
        const res = await axios.get(`https://bells.quark.blue/api/block-height/${query}`);
        navigate(`/explorer/block/${res.data}`);
      } else {
        navigate(`/explorer/tx/${query}`);
      }
    }
  };
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
