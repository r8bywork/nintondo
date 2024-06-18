import axios from 'axios';
import { FormEvent, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSvg from '../../../assets/Button.svg?react';
import ReplySvg from '../../../assets/marketplace/reply.svg?react';
import { truncate } from '@/utils';
import { OriginalOrd } from '@/interfaces/nintondo-manager-provider';
import { useGetOrdByTxid } from '@/hooks/explorerapi';
import { useNintondoManagerContext } from '@/utils/bell-provider';

interface SearchProps {
  placeholder?: string;
  reply?: boolean;
  utxo?: boolean;
  pressResults?: (res: OriginalOrd) => void;
}

const Search = ({ pressResults, placeholder, reply, utxo }: SearchProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const { address } = useNintondoManagerContext();
  const [results, setResults] = useState<OriginalOrd[] | null>(null);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const searchRef = useRef<HTMLFormElement | null>(null);
  const getOrd = useGetOrdByTxid()

  const searchAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query')?.toString().trim();

    if (!query || !address) {
      return
    }

    if (utxo) {
      await getOrd(address, query).then(res => {
        if (res && res.length > 0) {
          setResults(res);
          setShowPopover(true);
        }
      }).catch(_ => {
        setResults(null);
        setShowPopover(false);
      })
    } else {
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
    }
    setQuery('');
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form
      ref={searchRef}
      className='flex gap-4 items-center w-full max-w-3xl relative'
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
      {showPopover && results && pressResults && (
        <div className='absolute bg-[#1A1A1A] text-white p-4 rounded-lg mt-2 z-10 animate-[slide-in_0.1s_ease-out] left-0 w-fit flex flex-col items-start gap-2'
          style={{ top: 'calc(100% + 10px)' }}
        >
          {results.map((result: any, index: number) => (
            <div key={index} className='text-white hover:text-yellow-500 cursor-pointer'>
              <a onClick={() => { pressResults(result); setShowPopover(false) }}>
                {truncate(result.txid, {
                  nPrefix: (window.innerWidth <= 1240) ? 16 : 32,
                  nSuffix: window.innerWidth <= 1240 ? 16 : 32,
                })}
              </a>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default Search;
