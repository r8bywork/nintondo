import { useMemo, useState } from 'react';

export const useWithStatistic = <T>(
  data: T[],
  statsConverters: Record<string, <V>(data: T[]) => V>,
) => {
  const [dataState, setDataState] = useState<T[]>(data);
  const stats = useMemo(() => {
    return Object.entries(statsConverters).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [key]: value(dataState),
        };
      },
      {} as {
        [key: keyof typeof statsConverters]: ReturnType<
          (typeof statsConverters)[keyof typeof statsConverters]
        >;
      },
    );
  }, [dataState]);

  return {
    dataState,
    stats,
    setDataState,
  };
};
