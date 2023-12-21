const Text = () => {
  return (
    <div className={'text-white flex flex-col items-center'}>
      <span className='bg-black text-center mb-8 text-[40px] px-[20px] relative'>
        Cryptocurrency based on the game{' '}
        <span className={' text-regal-yellow'}>Animal Crossing</span>
        <div className='absolute right-0 bottom-0 w-4 h-14 bg-yellow-500'></div>
      </span>

      <span className='w500px bg-black font-inconsolata text-[20px] px-2 my-1 relative'>
        Mine <span className='text-yellow-500'>Bells</span> with a special{' '}
        <span className={'text-regal-blue'}>wallet</span>,{' '}
        <span className={'text-regal-blue'}>exchange</span> them for other
      </span>

      <span className='bg-black'>
        cryptocurrencies and track them with <span className={'text-regal-blue'}>explorer</span>.
      </span>
    </div>
  );
};

export default Text;
