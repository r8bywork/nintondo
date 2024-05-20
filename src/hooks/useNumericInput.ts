import { useState } from 'react';

const NUMBER_REGEX = /^[0-9]*[\.]?[0-9]*$/;
const INTEGER_REGEX = /^[0-9]*$/;

type NumberInput = [string, (value: number | string) => void, () => number];

interface NumericInputOptions {
  integerOnly: boolean;
}

export const useNumericInput = (
  value: number | string,
  options?: NumericInputOptions,
): NumberInput => {
  const mathcingRegex = options?.integerOnly ? INTEGER_REGEX : NUMBER_REGEX;

  const [numericValue, setNumericValue] = useState(value.toString());

  const handleChange = (value: number | string) => {
    if (!value.toString().match(mathcingRegex)) {
      return;
    }

    if (Number(value) > Number.MAX_SAFE_INTEGER) {
      return;
    }

    const numeric = Number(value);
    const secondPart = value.toString().split('.').at(1);

    setNumericValue(`${Math.trunc(numeric)}${secondPart !== undefined ? `.${secondPart}` : ''}`);
  };

  const getValidNumber = () => {
    return Number(numericValue);
  };

  return [numericValue, handleChange, getValidNumber];
};
