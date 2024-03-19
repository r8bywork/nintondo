import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSvg from '../../../assets/Button.svg?react';
import ReplySvg from '../../../assets/marketplace/reply.svg?react';

interface SearchProps {
  placeholder?: string;
  reply?: boolean;
}

const Search = ({ placeholder, reply }: SearchProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');

  const searchAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query')?.toString().trim();

    if (query) {
      const isTxHash = /^[0-9a-fA-F]{64}$/.test(query);
      const isBlockHash = /^[0-9]+$/.test(query);
      const isAddress = /^[a-zA-Z0-9]+$/.test(query);

      if (isBlockHash) {
        const res = await axios.get(`https://bells.quark.blue/api/block-height/${query}`);
        navigate(`/explorer/block/${res.data}`);
      } else if (isTxHash) {
        navigate(`/explorer/tx/${query}`);
      } else if (isAddress) {
        navigate(`/explorer/address/${query}`);
      } else {
        console.error('Invalid input format');
      }

      setQuery('');
    }
  };
  const replyAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query')?.toString().trim();

    if (query) {
      console.log('send', query);
      setQuery('');
    }
  };

  return (
    <form
      className='flex gap-4 items-center w-full max-w-3xl '
      onSubmit={reply ? replyAction : searchAction}
    >
      <input
        name={'query'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='w-full rounded-full py-[7px] bg-black/80 border-2 text-white text-[14px] placeholder-white/60 px-5 outline-none focus:border-orange-500 transition-colors leading-[14px]'
        placeholder={
          placeholder ? placeholder : 'Search for blocks height, hash, transactions, or address.'
        }
        type='text'
      />
      <button
        type='submit'
        className='flex'
      >
        {reply ? <ReplySvg className={'flex'} /> : <ButtonSvg className='flex' />}
      </button>
    </form>
  );
};

export default Search;
