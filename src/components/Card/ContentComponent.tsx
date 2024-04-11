import ModelViewerComponent from './ModelViewerComponent.tsx';
import JsonViewer from 'components/Card/JsonViewer.tsx';
interface ContentComponentProps {
  contentType: string;
  image: string;
  imageSize: string;
  blurImage?: boolean;
  onLoadHandler: () => void;
}

const ContentComponent = ({
  contentType,
  image,
  imageSize,
  onLoadHandler,
  blurImage,
}: ContentComponentProps) => {
  return (
    <>
      {contentType === 'image' ? (
        <div style={{ imageRendering: 'pixelated' }}>
          {blurImage && (
            <div
              className={
                'flex size-[180px] rounded-[10px] bg-black/10 backdrop-blur-md bg-black absolute'
              }
            ></div>
          )}
          <img
            alt={'image'}
            src={image}
            style={{ width: imageSize, height: imageSize }}
            onLoad={onLoadHandler}
            className={'rounded-[10px] mb-[18px]'}
          />
        </div>
      ) : contentType === 'model' ? (
        <ModelViewerComponent
          src={image}
          imageSize={imageSize}
        />
      ) : (
        <div
          className='mb-[18px] text-white flex flex-col overflow-hidden'
          style={{
            maxWidth: imageSize,
            height: imageSize,
            overflowWrap: 'anywhere',
          }}
        >
          <JsonViewer jsonString={image} />
        </div>
      )}
    </>
  );
};

export default ContentComponent;
