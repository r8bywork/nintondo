import { CONTENT_API_URL } from '@/consts';

interface ContentComponentProps {
  contentType: string;
  url: string;
  imageSize: string;
  blurImage?: boolean;
  onLoadHandler: () => void;
}

const ContentComponent = ({
  contentType,
  url,
  imageSize,
  onLoadHandler,
  blurImage,
}: ContentComponentProps) => {
  return (
    <>
      {contentType === 'image' ? (
        <div
          className='flex justify-center'
          style={{ imageRendering: 'pixelated' }}
        >
          {blurImage && (
            <div
              className={
                'flex size-[180px] rounded-[10px] bg-black/10 backdrop-blur-md bg-black absolute'
              }
            ></div>
          )}
          <img
            alt={'image'}
            src={url}
            style={{ width: imageSize, height: imageSize }}
            onLoad={onLoadHandler}
            className={'rounded-[10px] mb-[18px]'}
          />
        </div>
      ) : (
        <iframe
          src={`${CONTENT_API_URL}/pub/html/${url}`}
          sandbox='allow-scripts'
          loading='lazy'
          scrolling='no'
          onLoad={onLoadHandler}
          className={`rounded-[10px] flex justify-center items-center w-[${imageSize}] h-[${imageSize}]`}
        />
      )}
    </>
  );
};

export default ContentComponent;
