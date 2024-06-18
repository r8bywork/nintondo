import axios from 'axios';
import { FormEvent, useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSvg from '../../../assets/Button.svg?react';
import ReplySvg from '../../../assets/marketplace/reply.svg?react';
import { truncate } from '@/utils';
import { useGetOrdByTxid } from '@/hooks/explorerapi';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import { debounce } from 'lodash';
interface SearchProps<T> {
  placeholder?: string;
  reply?: boolean;
  utxo?: boolean;
  pressResults?: (res: T) => void;
}

const isTxHash = (query: string) => /^[0-9a-fA-F]{64}$/.test(query);
const isBlockHash = (query: string) => /^[0-9]+$/.test(query);
const isAddress = (query: string) => /^[a-zA-Z0-9]+$/.test(query);

const Search = <T,>({ pressResults, placeholder, reply, utxo }: SearchProps<T>) => {
  const navigate = useNavigate();
  const { address } = useNintondoManagerContext();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<T[] | null>(null);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const searchRef = useRef<HTMLFormElement | null>(null);
  const [prefixSuffix, setPrefixSuffix] = useState({ nPrefix: 32, nSuffix: 32 });
  const getOrd = useGetOrdByTxid();
  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;

    if (utxo && address) {
      await getOrd(address, query).then((res) => {
        setResults(res as T[]);
        setShowPopover(true);
      }).catch((_) => {
        setResults(null);
        setShowPopover(false);
      })
    } else {
      if (isBlockHash(query)) {
        const res = await axios.get(`https://bells.quark.blue/api/block-height/${query}`);
        navigate(`/explorer/block/${res.data}`);
      } else if (isTxHash(query)) {
        navigate(`/explorer/tx/${query}`);
      } else if (isAddress(query)) {
        navigate(`/explorer/address/${query}`);
      } else {
        console.error('Invalid input format');
      }
    }
  }, [address, navigate, getOrd, utxo]);

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);
  useEffect(() => {
    if (query && utxo) {
      debouncedHandleSearch(query);
    }
  }, [query, utxo, handleSearch]);

  const searchAction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const queryValue = formData.get('query')?.toString().trim();
    handleSearch(queryValue!);
    setQuery('');
  };
  const replyAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const queryValue = formData.get('query')?.toString().trim();

    if (query) {
      console.log('send', queryValue);
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

  useEffect(() => {
    const updatePrefixSuffix = () => {
      const width = window.innerWidth;
      const baseValue = Math.max(32 - Math.floor((1920 - width) / 100), 10);
      setPrefixSuffix({ nPrefix: baseValue, nSuffix: baseValue });
    };

    updatePrefixSuffix();
    window.addEventListener('resize', updatePrefixSuffix);
    return () => {
      window.removeEventListener('resize', updatePrefixSuffix);
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
        placeholder={placeholder ?? 'Search for blocks height, hash, transactions, or address.'}
        type='text'
      />
      <button type='submit' className='flex'>
        {reply ? <ReplySvg className='flex' /> : <ButtonSvg className='flex' />}
      </button>
      {showPopover && results && (
        <div className='absolute bg-[#1A1A1A] text-white p-4 rounded-lg mt-2 z-10 animate-[slide-in_0.1s_ease-out] left-0 w-fit flex flex-col items-start gap-2'
          style={{ top: 'calc(100% + 10px)' }}>
          {results && results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className='text-white hover:text-yellow-500 cursor-pointer'>
                <a onClick={() => { pressResults?.(result); setShowPopover(false) }}>
                  {truncate((result as any).txid, {
                    nPrefix: prefixSuffix.nPrefix,
                    nSuffix: prefixSuffix.nSuffix,
                  })}
                </a>
              </div>
            ))
          ) : (
            <div className='text-white cursor-default'>
              Nothing found
            </div>)}
        </div>
      )}
    </form>
  );
};

export default Search;
