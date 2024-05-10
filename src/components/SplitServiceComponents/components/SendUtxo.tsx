import { FC } from 'react';
import cn from 'classnames';
import { isValidBitcoinAddress } from '@/utils';
import { Ord } from '@/interfaces/nintondo-manager-provider';

interface SendUtxoProps {
  setSelectedOrds: (ords: Ord[]) => void;
  selectedOrds: Ord[];
  ord: Ord;
}

const SendUtxo: FC<SendUtxoProps> = ({ setSelectedOrds, selectedOrds, ord }) => {
  return (
    <div className='flex flex-col p-3 gap-1 w-full'>
      <span className='text-sm'>Enter receivers address</span>
      <input
        type='text'
        className={cn('p-2 bg-black border-2 border-[#191919] rounded-lg', {
          'border-red-500': !ord.verifiedSendAddress && ord.send,
          'border-lime-500': ord.verifiedSendAddress && ord.send,
        })}
        value={ord.sendToAddress}
        onChange={(e) => {
          setSelectedOrds(
            selectedOrds.map((o) =>
              o.txid === ord.txid
                ? {
                    ...o,
                    sendToAddress: e.target.value.trim(),
                    verifiedSendAddress: isValidBitcoinAddress(e.target.value.trim()),
                  }
                : o,
            ),
          );
        }}
      />
    </div>
  );
};

export default SendUtxo;
