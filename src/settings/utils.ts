type Params = {
  nPrefix?: number;
  nSuffix?: number;
  separator?: 'braces' | 'brackets' | 'parenthesis';
};

export const truncate = (str: string, { nPrefix = 4, nSuffix = 4 }: Params = {}) => {
  const nTotalIsLongerThanStr = nPrefix + nSuffix > str.length;
  return str && !nTotalIsLongerThanStr
    ? `${str.slice(0, nPrefix)}...${str.slice(str.length - nSuffix)}`
    : str;
};
