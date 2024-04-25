import { useCallback } from 'react';
import { useNintondoManagerContext } from '../utils/bell-provider';
import { ApiOrdUTXO, ApiUTXO } from '../interfaces/api';
import { Psbt, Transaction, networks } from 'belcoinjs-lib';
import { IDummyInscription } from '../interfaces/marketapi';
import { DEFAULT_FEE_RATE, DUMMY_UTXO_VALUE, FEE_ADDRESS } from '../consts';
import { fetchBELLMainnet, gptFeeCalculate } from '../utils';
import toast from 'react-hot-toast';
import { getApiUtxo, getTransactionRawHex } from './electrs';

export const useMakeDummyUTXOS = () => {
  const { signPsbtInputs } = useNintondoManagerContext();
  const { address } = useNintondoManagerContext();

  return useCallback(async (): Promise<ApiUTXO[] | undefined> => {
    if (!address) return;

    let utxos = await getApiUtxo(address);
    if (!utxos) return;
    for (const i of utxos) {
      i.rawHex = await getTransactionRawHex(i.txid);
    }

    if (utxos.filter((f) => f.rawHex === undefined).length > 0)
      throw new Error('Need raw hex in order to make dummy UTXOs');

    let psbt = new Psbt({ network: networks.bitcoin });
    for (const i of utxos) {
      psbt.addInput({
        hash: i.txid,
        index: i.vout,
        sequence: 0xffffffff,
        nonWitnessUtxo: Buffer.from(i.rawHex!, 'hex'),
      });
    }

    psbt.addOutput({
      address,
      value: DUMMY_UTXO_VALUE,
    });
    psbt.addOutput({
      address,
      value: DUMMY_UTXO_VALUE,
    });
    const change =
      utxos.reduce((acc, f) => (acc += f.value), 0) -
      gptFeeCalculate(utxos.length, 3, DEFAULT_FEE_RATE) -
      600 * 2;

    if (change <= 0) {
      toast.error('Not enough funds');
      return;
    }

    psbt.addOutput({
      address,
      value: change,
    });

    const signedPsbtBase64 = await signPsbtInputs(psbt.toBase64());
    if (!signedPsbtBase64) throw new Error('Failed to sign inputs to create dummys');

    psbt = Psbt.fromBase64(signedPsbtBase64);

    const transaction = psbt.finalizeAllInputs().extractTransaction(true);
    const txHex = transaction.toHex();
    const pushedTxId = await fetchBELLMainnet<string>({
      path: '/tx',
      method: 'POST',
      body: txHex,
      json: false,
    });

    if (!pushedTxId || pushedTxId.length !== 64) {
      toast.error(`${pushedTxId}`);
      return;
    }

    let txFound = false;
    while (!txFound) {
      const utxos = await fetchBELLMainnet<ApiUTXO[]>({
        path: `/address/${address}/utxo`,
      });
      if (utxos === undefined || utxos.find((f) => f.txid === transaction.getId()) === undefined)
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(undefined);
          }, 2000);
        });
      else txFound = true;
    }

    utxos = [];
    for (let i = 0; i <= transaction.outs.length - 1; i++) {
      utxos.push({
        txid: transaction.getId(),
        vout: i,
        value: transaction.outs[i].value,
        rawHex: txHex,
      });
    }
    return utxos;
  }, [signPsbtInputs, address, getApiUtxo, getTransactionRawHex]);
};

export const useCreateListedSignedPSBT = () => {
  const { address } = useNintondoManagerContext();
  const { signPsbtInputs } = useNintondoManagerContext();

  const placeholderTxId = 'f56443f446775e1ce6383265f1556ee85f203902ba3313af3142f88821ed2431';
  const placeHolderTxhex =
    '0100000002f32f71a80dd8164b0eaf529138e5c42a3e169d36d536e3b988beb16ef57a529c000000006a47304402206392b7da51ea764ded9408984c338725774b5fdea0cf47c64a1d6359dff6cdbb02201b66736dba68bc4d066c1b7bef69671428f45d1861cb5711a197f78607a1ae8d012102377314555a79463834563a5132b73a4eed5230cfd64f324713a329ca4316a258ffffffff99a4129978080da13a80f6ac683e8672655c7f2d4301793d57fbac11b0bf21cc000000006a473044022043be610441ed03f2db27e8b133c608510001f262f3446b29e236f17e5a54b06502206389e2319446105f47c596b311cebe55f10eab26a6c49610ee99e90c7afb0221012102377314555a79463834563a5132b73a4eed5230cfd64f324713a329ca4316a258ffffffff027ac3f381010000001976a914f3b61d5ce671285b82228ac1c03fc6680f2a435b88acf82ff005000000001976a914e73cff340fc96c6960298c1214ce57d053b638ab88ac00000000';
  const placeholderTxId2 = '9c527af56eb1be88b9e336d5369d163e2ac4e5389152af0e4b16d80da8712ff3';
  const placeHolderTxhex2 =
    '0100000002522898374277a2afe45cbb7012432350d0d39e1b2f5b494e02543f8303183a95020000006a4730440220048f9c107bf6f734f1ea2038051612525108ec06787232ea011c382b2f8660c002204f0c20f8f7ee984d4dc95be8a91bfd80dd0f3270fec9b3143173a2055b189c330121025bc22d727141b3c366ac2c3f438775f7024682e6fdbaaa9801b45f67f572415cffffffff7cae8b5adddfa59b45f4020beef146c67e11abfe17e983ed640c5a1736894e40020000006a47304402204f024ba023ddf7e6acfb8f8505be816a8d2edefe1cfc085259f70d3fd8533aa00220112d105228fa58f483a28d0edade809a3be67b75c1d3d9a06fd0aeb47444cf640121025bc22d727141b3c366ac2c3f438775f7024682e6fdbaaa9801b45f67f572415cffffffff027ac3f381010000001976a914e73cff340fc96c6960298c1214ce57d053b638ab88ac722ff7b4000000001976a9142244caa73f879e7b2f494020b26b36b870c4f72588ac00000000';
  const placeholderAddress = 'BRXknAc5gRVSh6Yo3Gs8hgwRPa3mumBwcm';

  return useCallback(
    async (inscription: { txid: string; vout: number }, price: number) => {
      if (!address) return;
      const sellerOrdUtxoHex = await getTransactionRawHex(inscription.txid);
      if (!sellerOrdUtxoHex) return;
      let sellerPsbt = new Psbt({ network: networks.bitcoin });

      sellerPsbt.addInput({
        hash: placeholderTxId,
        index: 0,
        nonWitnessUtxo: Buffer.from(placeHolderTxhex, 'hex'),
      });

      sellerPsbt.addInput({
        hash: placeholderTxId2,
        index: 0,
        nonWitnessUtxo: Buffer.from(placeHolderTxhex2, 'hex'),
      });

      sellerPsbt.addInput({
        hash: inscription.txid,
        index: inscription.vout,
        nonWitnessUtxo: Buffer.from(sellerOrdUtxoHex, 'hex'),
        sighashType: Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
      });

      sellerPsbt.addOutput({
        address: placeholderAddress,
        value: 2,
      });
      sellerPsbt.addOutput({
        address: placeholderAddress,
        value: 2,
      });
      sellerPsbt.addOutput({
        address: address,
        value: Number(price * 10 ** 8),
      });

      const partiallySignedPsbtbase64 = await signPsbtInputs(sellerPsbt.toBase64(), {
        autoFinalized: false,
        toSignInputs: [
          {
            address,
            index: 2,
            sighashTypes: [Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY],
          },
        ],
      });

      if (!partiallySignedPsbtbase64) return toast.error('Failed to sign psbt');
      sellerPsbt = Psbt.fromBase64(partiallySignedPsbtbase64);
      sellerPsbt.finalizeInput(2);
      return sellerPsbt.toBase64();
    },
    [address, getTransactionRawHex, signPsbtInputs],
  );
};

export const useCheckInscription = () => {
  const { address } = useNintondoManagerContext();

  return useCallback(
    async (inscription: IDummyInscription): Promise<ApiOrdUTXO | undefined> => {
      if (!address) return;
      const foundInscriptions = await fetchBELLMainnet<ApiOrdUTXO[]>({
        path: `/address/${inscription.address}/ords?search=${inscription.inscription_id}`,
      });
      if (!foundInscriptions || foundInscriptions.length <= 0) return;
      const sellerOrdUtxo = foundInscriptions[0];
      if (!sellerOrdUtxo) {
        toast.error(`Failed to find seller utxo: ${inscription.txid}`);
        return;
      }
      sellerOrdUtxo.rawHex = await getTransactionRawHex(sellerOrdUtxo?.txid);
      return sellerOrdUtxo;
    },
    [address, getTransactionRawHex],
  );
};

export const useHasEnoughUtxos = () => {
  const { address } = useNintondoManagerContext();

  return useCallback(async (): Promise<ApiUTXO[] | undefined> => {
    if (!address) return;
    const utxos = await getApiUtxo(address);
    if (!utxos || utxos.length <= 2) return;
    for (const i of utxos) {
      i.rawHex = await getTransactionRawHex(i.txid);
    }
    return utxos;
  }, [address, getApiUtxo, getTransactionRawHex]);
};

export const useCreateBuyingSignedPsbt = () => {
  const { address, signPsbtInputs } = useNintondoManagerContext();

  return useCallback(
    async (inscription: IDummyInscription, sellerOrdUtxo: ApiOrdUTXO, utxos: ApiUTXO[]) => {
      if (!address) return;
      utxos = utxos.sort((a, b) => a.value - b.value);

      let buyerPsbt = new Psbt({ network: networks.bitcoin });

      buyerPsbt.addInput({
        hash: utxos[0].txid,
        index: utxos[0].vout,
        nonWitnessUtxo: Buffer.from(utxos[0].rawHex!, 'hex'),
      });
      buyerPsbt.addInput({
        hash: utxos[1].txid,
        index: utxos[1].vout,
        nonWitnessUtxo: Buffer.from(utxos[1].rawHex!, 'hex'),
      });
      buyerPsbt.addInput({
        hash: sellerOrdUtxo.txid,
        index: sellerOrdUtxo.vout,
        nonWitnessUtxo: Buffer.from(sellerOrdUtxo.rawHex!, 'hex'),
        sighashType: Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
      });
      const splicedUtxos = utxos.splice(0, 2);
      utxos.forEach((f) => {
        buyerPsbt.addInput({
          hash: f.txid,
          index: f.vout,
          nonWitnessUtxo: Buffer.from(f.rawHex!, 'hex'),
        });
      });

      buyerPsbt.addOutput({
        address: address,
        value: DUMMY_UTXO_VALUE * 2,
      });
      buyerPsbt.addOutput({
        address: address,
        value: sellerOrdUtxo.value,
      });
      buyerPsbt.addOutput({
        address: inscription.address,
        value: inscription.price,
      });
      buyerPsbt.addOutput({
        address: FEE_ADDRESS,
        value: 0.02 * 10 ** 8,
      });
      buyerPsbt.addOutput({
        address: address,
        value: DUMMY_UTXO_VALUE,
      });
      buyerPsbt.addOutput({
        address: address,
        value: DUMMY_UTXO_VALUE,
      });

      const fee = gptFeeCalculate(utxos.length + 2, 7, DEFAULT_FEE_RATE);

      const change =
        utxos.concat(splicedUtxos).reduce((acc, cur) => acc + cur.value, 0) -
        fee -
        splicedUtxos.reduce((acc, sum) => (acc += sum.value), 0) +
        600 * 2 -
        inscription.price -
        0.02 * 10 ** 8;

      if (change <= 0) return toast.error('Not enough funds');

      buyerPsbt.addOutput({
        address: address,
        value: change,
      });

      const inputsToSign = [0, 1, ...utxos.map((_, i) => i + 3)];
      const partiallySignedPsbtBase64 = await signPsbtInputs(buyerPsbt.toBase64(), {
        autoFinalized: false,
        toSignInputs: inputsToSign.map((f) => ({
          address,
          index: f,
          sighashTypes: undefined,
        })),
      });
      if (!partiallySignedPsbtBase64) {
        toast.error('Failed to sign buyer inputs');
        return;
      }

      buyerPsbt = Psbt.fromBase64(partiallySignedPsbtBase64);
      inputsToSign.forEach((f) => {
        buyerPsbt.finalizeInput(f);
      });
      return buyerPsbt.toBase64();
    },
    [address, signPsbtInputs],
  );
};
