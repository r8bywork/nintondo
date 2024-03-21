import { Ord } from '@/interfaces/nintondo-manager-provider';
import BigArrowRight from '@/assets/BigArrowRight.svg?react';
import { FC } from 'react';

interface SplitVisualizerProps {
  selectedOrds: Ord[];
}

const SplitVisualizer: FC<SplitVisualizerProps> = ({ selectedOrds }) => {
  return (
    <div className='flex flex-col min-w-[50%]'>
      <div className='flex flex-col'>
        <div className='w-full flex justify-center items-center'>
          <p className='text-lg font-medium'>Splits</p>
        </div>
      </div>

      <div className='flex flex-col max-h-192 overflow-y-scroll custom_scrollbar_container'>
        {selectedOrds.map((f, i) => (
          <div
            key={i}
            className='flex items-center'
          >
            <div className='flex flex-col p-3 m-3 border-[#191919] border-2 max-w-fit rounded-lg'>
              <p>Value: {(f.value / 10 ** 8).toFixed(4)} BEL</p>
              <p>Inscriptions: {f.inscriptions.length}</p>
              <p>Retrievable bells amount: {(f.available_to_free / 10 ** 8).toFixed(4)} BEL</p>
            </div>
            <BigArrowRight className='h-4' />
            <div className='flex flex-col p-3 m-3 max-w-fit rounded-lg gap-5'>
              <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg'>
                <span>Inscription(s):</span>
                <div className='flex gap-3 justify-center'>
                  {f.inscriptions.map((inscription, index) => (
                    <a
                      key={index}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex flex-col items-center gap-2'
                      href={`http://localhost:8111/pub/preview/${inscription.inscription_id}`}
                    >
                      <div className='w-28 h-28 overflow-hidden rounded-lg'>
                        <img
                          src={`http://localhost:8111/pub/preview/${inscription.inscription_id}`}
                          className='object-cover'
                        />
                      </div>
                      <span>Value: 0.001 BEL</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-1 bg-[#1A1A1A] p-3 rounded-lg'>
                <span>Retrievable balance:</span>
                <p>Value: {(f.available_to_free / 10 ** 8).toFixed(4)} BEL</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitVisualizer;
