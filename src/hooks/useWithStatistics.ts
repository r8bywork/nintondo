import { useState } from 'react';

const createNumericObjectFromKeys = <Obj extends object, T extends keyof Obj>(keys: T[]) =>
  keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Record<T, number>);

export const useWithStatistic = <T extends object>(
  data: T[],
  statsFields: Array<keyof T>,
): [
  T[],
  {
    stats: Record<keyof T, number>;
    clearState: () => void;
    addItem: (item: T) => void;
    removeItem: (item: T, checkKey: keyof T) => void;
    forceSet: (data: T[]) => void;
  },
] => {
  const [dataState, setDataState] = useState(data);
  const [stats, setStats] = useState(createNumericObjectFromKeys<T, keyof T>(statsFields));

  const addItem = (item: T) => {
    setDataState((dataState) => [...dataState, item]);
    setStats((stats) => {
      return Object.keys(stats).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (stats[key as keyof T] as number) + (item[key as keyof T] as number),
        }),
        {} as Record<keyof T, number>,
      );
    });
  };

  const removeItem = (item: T, checkKey: keyof T) => {
    setDataState((dataState) => dataState.filter((v) => v[checkKey] !== item[checkKey]));
    setStats((stats) => {
      return Object.keys(stats).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (stats[key as keyof T] as number) - (item[key as keyof T] as number),
        }),
        {} as Record<keyof T, number>,
      );
    });
  };

  const forceStatsRecalculate = (data: T[]) => {
    return data.reduce(
      (acc, item) => {
        return statsFields.reduce(
          (fieldAcc, key) => ({
            ...fieldAcc,
            [key]: (acc[key as keyof T] as number) + (item[key as keyof T] as number),
          }),
          {} as Record<keyof T, number>,
        );
      },
      createNumericObjectFromKeys<T, keyof T>(statsFields) as Record<keyof T, number>,
    );
  };

  const forceSet = (data: T[]) => {
    setDataState(data);
    setStats(forceStatsRecalculate(data));
  };

  const clearState = () => {
    setDataState(data);
    setStats(createNumericObjectFromKeys<T, keyof T>(statsFields));
  };

  return [
    dataState,
    {
      stats,
      addItem,
      removeItem,
      forceSet,
      clearState,
    },
  ];
};
