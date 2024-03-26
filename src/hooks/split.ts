import { BURN_ADDRESS, DEFAULT_FEE_RATE, ORD_VALUE } from '@/consts';
import { Ord } from '@/interfaces/nintondo-manager-provider';
import { gptFeeCalculate } from '@/utils';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import { networks, Psbt } from 'belcoinjs-lib';

export const useSplitOrds = () => {
  const { address, verifiedAddress, signPsbtInputs } = useNintondoManagerContext();

  return async (ords: Ord[]) => {
    if (!address || !verifiedAddress) return;

    const psbt = new Psbt({ network: networks.bitcoin });
    ords.forEach((f) => {
      psbt.addInput({
        hash: f.txid,
        index: f.vout,
        nonWitnessUtxo: Buffer.from(f.raw_hex, 'hex'),
      });
    });

    let change = 0;

    ords.forEach((utxo) => {
      const addedValues: number[] = [];
      const sortedInscriptions = utxo.inscriptions.sort((a, b) => a.offset - b.offset);
      sortedInscriptions.forEach((inscription) => {
        const availableToFree =
          inscription.offset - (addedValues.reduce((acc, v) => (acc += v), 0) + ORD_VALUE);

        if (inscription.offset > 0 && availableToFree > 0) {
          psbt.addOutput({
            address,
            value: availableToFree,
          });
          addedValues.push(availableToFree);
        }
        psbt.addOutput({
          address: inscription.burn ? BURN_ADDRESS : address,
          value: ORD_VALUE,
        });
        addedValues.push(ORD_VALUE);
      });
      change += utxo.value - addedValues.reduce((acc, v) => (acc += v), 0);
    });

    if (change - gptFeeCalculate(ords.length, psbt.txOutputs.length + 1, DEFAULT_FEE_RATE) > 0)
      psbt.addOutput({
        address,
        value: change - gptFeeCalculate(ords.length, psbt.txOutputs.length + 1, DEFAULT_FEE_RATE),
      });
    else {
      throw new Error('FUCK');
    }

    const signedPsbtBase64 = await signPsbtInputs(psbt.toBase64());
    if (!signedPsbtBase64) return;
    const signedPsbt = Psbt.fromBase64(signedPsbtBase64);

    console.log(signedPsbt.finalizeAllInputs().extractTransaction(true).toHex());
  };
};