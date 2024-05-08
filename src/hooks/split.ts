/* eslint-disable camelcase */
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

  const addInputsAndOutputs = (psbt: Psbt, ords: Ord[], feeRate: number) => {
    if (!address) return;
    ords.forEach((ord) => {
      psbt.addInput({
        hash: ord.txid,
        index: ord.vout,
        nonWitnessUtxo: Buffer.from(ord.raw_hex, 'hex'),
      });
    });

    ords.forEach((ord) => {
      const addedValues: number[] = [];
      if (ord.send && ord.sendToAddress) {
        if (!ord.verifiedSendAddress) throw new Error('One of send addresses is invalid');
        psbt.addOutput({
          address: ord.sendToAddress,
          value: ord.value,
        });
      } else {
        ord.inscriptions
          .sort((a, b) => a.offset - b.offset)
          .forEach((inscription) => {
            const availableToFree = inscription.offset - addedValues.reduce((acc, v) => acc + v, 0);
            if (inscription.offset > 0 && availableToFree > 1000) {
              psbt.addOutput({ address, value: availableToFree });
              addedValues.push(availableToFree);
            }
            psbt.addOutput({ address, value: ORD_VALUE });
            addedValues.push(ORD_VALUE);
          });
      }

      const remainingValue =
        ord.value -
        addedValues.reduce((acc, v) => acc + v, 0) -
        gptFeeCalculate(ords.length, psbt.txOutputs.length + 1, feeRate);
      if (remainingValue >= 1000) {
        psbt.addOutput({ address, value: remainingValue });
      }
    });
  };

  const handleFeeAndChange = async (psbt: Psbt, feeRate: number) => {
    if (!address) return;
    const requiredFee = gptFeeCalculate(psbt.txInputs.length, psbt.txOutputs.length + 1, feeRate);
    const utxos = await getApiUtxo(address!);
    if (!utxos || !utxos.length)
      throw new Error(
        `You need additional ${(requiredFee + 1000) / 10 ** 8} BELL in order to split`,
      );

    let totalUtxoValue = 0;
    for (const utxo of utxos) {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        nonWitnessUtxo: Buffer.from((await getTransactionRawHex(utxo.txid))!, 'hex'),
      });
      totalUtxoValue += utxo.value;
      if (totalUtxoValue - 1000 > requiredFee) {
        psbt.addOutput({ address, value: totalUtxoValue - requiredFee });
        break;
      }
    }

    if (totalUtxoValue - 1000 <= requiredFee)
      throw new Error(
        `You need additional ${(requiredFee + 1000) / 10 ** 8} BELL in order to split`,
      );
  };

  return async (ords: Ord[], feeRate: number) => {
    if (!address || !verifiedAddress) return;

    const psbt = new Psbt({ network: networks.bitcoin });

    try {
      addInputsAndOutputs(psbt, ords, feeRate);
      await handleFeeAndChange(psbt, feeRate);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
    }

    const signedPsbtBase64 = await signPsbtInputs(psbt.toBase64());
    if (!signedPsbtBase64) return;
    const signedPsbt = Psbt.fromBase64(signedPsbtBase64);
    signedPsbt.finalizeAllInputs();

    const hex = signedPsbt.extractTransaction(true).toHex();
    console.log(hex);
    const result = await pushSplit({
      transaction_hex: hex,
      locations: ords.map((ord) => `${ord.txid}:${ord.vout}`),
    });

    if (!result || result.length !== 64 || (result as string).includes('RPC error')) {
      toast.error(result);
      return;
    }
    return result as string;
  };
};
