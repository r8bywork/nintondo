import React from 'react';

interface JsonViewerProps {
  jsonString: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonString }) => {
  try {
    const jsonObject = JSON.parse(jsonString);
    const prettyJson = JSON.stringify(jsonObject, null, 2);
    return <pre>{prettyJson}</pre>;
  } catch {
    return <pre className={'whitespace-pre-wrap overflow-y-auto'}>{jsonString}</pre>;
  }
};

export default JsonViewer;
