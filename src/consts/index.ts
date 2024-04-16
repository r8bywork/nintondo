// export const HOST = 'http://192.168.0.108:8111';
// export const HOST = 'http://localhost:8111';
// export const HOST = 'https://static.nintondo.io';
export const HOST = 'https://content.nintondo.io/api';

export const NINTONDO_API_URL = 'https://electrs.nintondo.io/api';
// export const TEST_API_URL = "http://0.0.0.0:3001";
export const TEST_API_URL = 'http://93.125.14.5:3000';

// export const MARKET_API_URL = 'http://138.201.132.34:8111';
// export const MARKET_HISTORY_API_URL = 'http://162.55.243.24:8222';

export const MARKET_API_URL = 'https://content.nintondo.io/api';
export const MARKET_HISTORY_API_URL = 'https://history.nintondo.io';

// export const MARKET_API_URL = 'http://localhost:8111';
// export const MARKET_HISTORY_API_URL = 'http://localhost:8222';

// export const TEST_API_URL = "https://6552-93-125-14-5.ngrok-free.app";
// export const TEST_API_URL = "http://192.168.0.102:3001";

// export const PREVIEW_URL =
//   "https://bellscdn.ordinalswallet.com/inscription/preview";

// export const CONTENT_URL =
//   "https://bellscdn.ordinalswallet.com/inscription/content";

export const PREVIEW_URL = `${HOST}/pub/preview`;
export const CONTENT_URL = `${HOST}/pub/content`;
// export const PREVIEW_URL = 'http://93.125.14.5:8111/pub/preview';
// export const CONTENT_URL = 'http://93.125.14.5:8111/pub/content';

export const DUMMY_UTXO_VALUE = 10_000;
export const DEFAULT_FEE_RATE = 100;
export const ORD_VALUE = 1000;

export const FEE_ADDRESS = 'BMPNoA3NXhWoL89AkvFpYHEv8orNpUn5qq';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'https://content.nintondo.io/social';
export const DOMAIN: string = import.meta.env.VITE_DOMAIN ?? 'nintondo.io';
