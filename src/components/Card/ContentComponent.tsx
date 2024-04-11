import ModelViewerComponent from './ModelViewerComponent.tsx';

interface ContentComponentProps {
  contentType: string;
  image: string;
  imageSize: string;
  onLoadHandler: () => void;
}

const ContentComponent = ({
  contentType,
  image,
  imageSize,
  onLoadHandler,
}: ContentComponentProps) => {
  return (
    <>
      {contentType === 'image' ? (
        <div style={{ imageRendering: 'pixelated' }}>
          <img
            src={image}
            style={{ width: imageSize, height: imageSize }}
            onLoad={() => {
              console.log('loaded');
              onLoadHandler();
            }}
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
            width: imageSize,
            height: imageSize,
            overflowWrap: 'anywhere',
          }}
        >
          <pre className={'whitespace-pre-wrap'}>{image}</pre>
        </div>
      )}
    </>
  );
};

export default ContentComponent;
