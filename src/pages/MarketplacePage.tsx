import { useState } from 'react';

const MarketplacePage = () => {
  const [data, setData] = useState<{
    img_preview?: File;
    meta?: string;
    name?: string;
    inscriptions?: {
      content_type?: string;
      inscription_id?: string;
      number?: number;
    }[];
  }>();

  const sendShit = async () => {
    const formData = new FormData();

    if (data) {
      if (data.img_preview) {
        formData.append('img_preview', data.img_preview);
      }
      if (data.meta) {
        formData.append('meta', data.meta);
      }
      if (data.name) {
        formData.append('name', data.name);
      }
      if (data.inscriptions) {
        data.inscriptions.forEach((inscription, index) => {
          if (inscription.content_type) {
            formData.append(`inscriptions[${index}][content_type]`, inscription.content_type);
          }
          if (inscription.inscription_id) {
            formData.append(`inscriptions[${index}][inscription_id]`, inscription.inscription_id);
          }
          if (inscription.number) {
            formData.append(`inscriptions[${index}][number]`, inscription.number.toString());
          }
        });
      }
      const result = await fetch('http://localhost:7777', { method: 'POST', body: formData });
      console.log(await result.text());
    }
  };

  return (
    <div>
      <input
        type='file'
        onChange={(e) => {
          setData({
            // eslint-disable-next-line camelcase
            img_preview: e.target.files![0],
            meta: 'METADATA',
            inscriptions: [
              // eslint-disable-next-line camelcase
              { content_type: 'SHIT', inscription_id: 'inscription id', number: 2213 },
            ],
            name: 'first collection',
          });
        }}
      />
      <button onClick={sendShit}>Send shit</button>
    </div>
  );
};

export default MarketplacePage;
