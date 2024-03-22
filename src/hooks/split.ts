import { BURN_ADDRESS, ORD_VALUE } from '@/consts';
import { Ord } from '@/interfaces/nintondo-manager-provider';
import { useNintondoManagerContext } from '@/utils/bell-provider';
import { networks, Psbt } from 'belcoinjs-lib';

export const useSplitOrds = () => {
  const { address, verifiedAddress } = useNintondoManagerContext();

  return (ords: Ord[]) => {
    if (!address || !verifiedAddress) return;

    let freedAmount = 0;

    const psbt = new Psbt({ network: networks.bitcoin });
    ords.forEach((f) => {
      psbt.addInput({
        hash: f.txid,
        index: f.vout,
        nonWitnessUtxo: Buffer.from(f.raw_hex, 'hex'),
      });
    });

    ords.forEach((utxo) => {
      utxo.inscriptions.forEach((inscription) => {
        psbt.addOutput({
          address: inscription.burn ? BURN_ADDRESS : address,
          value: ORD_VALUE,
        });
      });
      freedAmount += utxo.value - ORD_VALUE * utxo.inscriptions.filter((f) => f.burn).length;
    });
  };
};
