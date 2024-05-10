import { useRef } from 'react';
import '@google/model-viewer';

interface ModelViewerComponentProps {
  src: string;
  imageSize: string;
}

const ModelViewerComponent = ({ src, imageSize }: ModelViewerComponentProps) => {
  const modelViewerRef = useRef<HTMLElement>(null);

  return (
    <model-viewer
      ref={modelViewerRef}
      src={src}
      ios-src='https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.usdz?v=1569545377878'
      poster='https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b%2Fposter-astronaut.png?v=1599079951717'
      alt='A 3D model of an astronaut'
      shadow-intensity='1'
      camera-controls
      auto-rotate
      style={{ width: imageSize, height: imageSize }}
    ></model-viewer>
  );
};

export default ModelViewerComponent;
