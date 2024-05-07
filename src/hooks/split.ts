import { BACKEND_URL, ORD_VALUE } from '@/consts';
import { Ord } from '@/interfaces/nintondo-manager-provider';
import { gptFeeCalculate } from '@/utils';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import { networks, Psbt } from 'belcoinjs-lib';
import { getApiUtxo, getTransactionRawHex } from './electrs';
import toast from 'react-hot-toast';
import { PushSplit } from '@/interfaces/marketapi';
import axios from 'axios';
import { useMakeAuthRequests } from './auth';

export const useSplitOrds = () => {
  const { address, verifiedAddress, signPsbtInputs } = useNintondoManagerContext();
  const makeAuthRequest = useMakeAuthRequests();

  const pushSplit = async (data: PushSplit) => {
    const result = await makeAuthRequest(() =>
      axios.post(`${BACKEND_URL}/split`, data, { withCredentials: true }),
    );
    return result?.data;
  };

  return async (ords: Ord[], feeRate: number) => {
    if (!address || !verifiedAddress) return;

    const psbt = new Psbt({ network: networks.bitcoin });
    ords.forEach((f) => {
      psbt.addInput({
        hash: f.txid,
        index: f.vout,
        nonWitnessUtxo: Buffer.from(f.raw_hex, 'hex'),
      });
    });

    for (const [i, utxo] of ords.entries()) {
      if (utxo.send && utxo.sendToAddress) {
        if (!utxo.verifiedSendAddress) return toast.error('One of send addresss is invalid');
        psbt.addOutput({
          address: utxo.sendToAddress,
          value: utxo.value,
        });
        if (i + 1 === ords.length) {
          const requiredFee = gptFeeCalculate(ords.length + 1, psbt.txOutputs.length + 1, feeRate);
          const utxos = await getApiUtxo(address);
          if (!utxos || !utxos.length)
            return toast.error(
              `You need additional ${(requiredFee + 1000) / 10 ** 8} BELL in order to split`,
            );
          const feeValues: number[] = [];
          for (const [i, f] of utxos.entries()) {
            psbt.addInput({
              hash: f.txid,
              index: f.vout,
              nonWitnessUtxo: Buffer.from((await getTransactionRawHex(f.txid))!, 'hex'),
            });
            feeValues.push(f.value);
            if (
              i === utxos.length - 1 &&
              feeValues.reduce((acc, v) => (acc += v), 0) - 1000 <= requiredFee
            )
              return toast.error(
                `You need additional ${(requiredFee + 1000) / 10 ** 8} BELL in order to split`,
              );
            if (feeValues.reduce((acc, v) => (acc += v), 0) - 1000 > requiredFee) break;
          }
          psbt.addOutput({
            address,
            value: feeValues.reduce((acc, v) => (acc += v), 0) - requiredFee,
          });
        }
      } else {
        const addedValues: number[] = [];
        const sortedInscriptions = utxo.inscriptions.sort((a, b) => a.offset - b.offset);
        sortedInscriptions.forEach((inscription) => {
          const availableToFree =
            inscription.offset - (addedValues.reduce((acc, v) => (acc += v), 0) + ORD_VALUE);

          if (inscription.offset > 0 && availableToFree > 1000) {
            psbt.addOutput({
              address,
              value: availableToFree,
            });
            addedValues.push(availableToFree);
          }
          psbt.addOutput({
            address: address,
            value: ORD_VALUE,
          });
          addedValues.push(ORD_VALUE);
        });
        if (i + 1 === ords.length) {
          const lastOutputValue =
            utxo.value -
            addedValues.reduce((acc, v) => (acc += v), 0) -
            gptFeeCalculate(ords.length, psbt.txOutputs.length + 1, feeRate);
          if (lastOutputValue >= 1000) {
            psbt.addOutput({
              address,
              value: lastOutputValue,
            });
          } else {
            if (utxo.value - addedValues.reduce((acc, v) => (acc += v), 0) > 1000)
              psbt.addOutput({
                address: address,
                value: utxo.value - addedValues.reduce((acc, v) => (acc += v), 0),
              });
            const requiredFee = gptFeeCalculate(
              ords.length + 1,
              psbt.txOutputs.length + 1,
              feeRate,
            );
            const utxos = await getApiUtxo(address);
            if (!utxos || !utxos.length)
              return toast.error(
                `You need additional ${(requiredFee + 1000) / 10 ** 8} BELL in order to split`,
              );
            const feeValues: number[] = [];
            for (const [i, f] of utxos.entries()) {
              psbt.addInput({
                hash: f.txid,
                index: f.vout,
                nonWitnessUtxo: Buffer.from((await getTransactionRawHex(f.txid))!, 'hex'),
              });
              feeValues.push(f.value);
              if (
                i === utxos.length - 1 &&
                feeValues.reduce((acc, v) => (acc += v), 0) - 1000 <= requiredFee
              )
                return toast.error(
                  `You need additional ${(requiredFee + 1000) / 10 ** 8} BELL in order to split`,
                );
              if (feeValues.reduce((acc, v) => (acc += v), 0) - 1000 > requiredFee) break;
            }
            psbt.addOutput({
              address,
              value: feeValues.reduce((acc, v) => (acc += v), 0) - requiredFee,
            });
          }
        } else {
          if (utxo.value - addedValues.reduce((acc, v) => (acc += v), 0) > 1000)
            psbt.addOutput({
              address: address,
              value: utxo.value - addedValues.reduce((acc, v) => (acc += v), 0),
            });
        }
      }
    }

    const signedPsbtBase64 = await signPsbtInputs(psbt.toBase64());
    if (!signedPsbtBase64) return;
    const signedPsbt = Psbt.fromBase64(signedPsbtBase64);
    signedPsbt.finalizeAllInputs();

    const hex = signedPsbt.extractTransaction(true).toHex();
    const result = await pushSplit({
      // eslint-disable-next-line camelcase
      transaction_hex: hex,
      locations: ords.map((f) => `${f.txid}:${f.vout}`),
    });
    if (!result) {
      return;
    }
    if (result.length !== 64 || (result as string).includes('RPC error')) {
      toast.error(result);
      return;
    }
    return result as string;
  };
};
