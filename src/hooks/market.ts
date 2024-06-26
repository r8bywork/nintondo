import { useCallback } from 'react';
import { useNintondoManagerContext } from '../utils/bell-provider';
import { ApiOrdUTXO, ApiUTXO } from '../interfaces/api';
import { Psbt, Transaction, networks } from 'belcoinjs-lib';
import { DUMMY_UTXO_VALUE, FEE_ADDRESS } from '../consts';
import { fetchBELLMainnet, gptFeeCalculate, shortAddress } from '../utils';
import toast from 'react-hot-toast';
import { getApiUtxo, getDummyUTXOS, getTransactionRawHex } from './electrs';
import { SignPsbtData } from '@/interfaces/nintondo-manager-provider';
import { PreparedToBuyInscription } from '@/interfaces/intefaces';
import { useSearchParams } from 'react-router-dom';
import { MarketplaceOrder } from '@/interfaces/marketapi';
import { ItemField } from '@/components/InlineTable/InlineTable';
import dayjs from 'dayjs';
import { EVENT_FILTERS, SORT_FILTERS } from '@/utils/market/constants';

export const useMakeDummyUTXOS = () => {
  const { signPsbtInputs } = useNintondoManagerContext();
  const { address } = useNintondoManagerContext();

  return useCallback(
    async (feeRate: number, inscriptionsPrices: number[]): Promise<ApiUTXO[] | undefined> => {
      if (!address) return;

      const targetSum =
        inscriptionsPrices.reduce((acc, val) => (acc += val), 0) +
        (0.01 * 10 ** 8 + DUMMY_UTXO_VALUE * 2 + gptFeeCalculate(4, 8, feeRate)) *
          inscriptionsPrices.length;

      let utxos = await getApiUtxo(address, { amount: targetSum, hex: true });
      if (!utxos || utxos.filter((f) => f.hex === undefined).length > 0)
        throw new Error('Need raw hex in order to make dummy UTXOs');

      let psbt = new Psbt({ network: networks.bitcoin });

      utxos.forEach((i) => {
        psbt.addInput({
          hash: i.txid,
          index: i.vout,
          sequence: 0xffffffff,
          nonWitnessUtxo: Buffer.from(i.hex!, 'hex'),
        });
      });

      inscriptionsPrices.forEach((i) => {
        psbt.addOutput({
          address,
          value: DUMMY_UTXO_VALUE,
        });

        psbt.addOutput({
          address,
          value: DUMMY_UTXO_VALUE,
        });

        psbt.addOutput({
          address,
          value: i,
        });
      });

      const change =
        utxos.reduce((acc, f) => (acc += f.value), 0) -
        gptFeeCalculate(utxos.length, 3, feeRate) -
        inscriptionsPrices.reduce((acc, val) => (acc += val), 0) -
        DUMMY_UTXO_VALUE * 2 * inscriptionsPrices.length;

      if (change < 0) {
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

      if (!pushedTxId || pushedTxId.length !== 64 || pushedTxId.includes('RPC error')) {
        toast.error(`${pushedTxId}`);
        return;
      }

      let txFound = false;
      while (!txFound) {
        const utxos = await getDummyUTXOS(address, inscriptionsPrices);

        if (utxos === undefined || !utxos.length)
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
          hex: txHex,
        });
      }

      return utxos;
    },
    [signPsbtInputs, address, getApiUtxo],
  );
};

export const useCreateListedSignedPSBT = () => {
  const { address } = useNintondoManagerContext();
  const { signPsbtInputs, signMultiPsbt } = useNintondoManagerContext();

  const placeholderTxId = 'f56443f446775e1ce6383265f1556ee85f203902ba3313af3142f88821ed2431';
  const placeHolderTxhex =
    '0100000002f32f71a80dd8164b0eaf529138e5c42a3e169d36d536e3b988beb16ef57a529c000000006a47304402206392b7da51ea764ded9408984c338725774b5fdea0cf47c64a1d6359dff6cdbb02201b66736dba68bc4d066c1b7bef69671428f45d1861cb5711a197f78607a1ae8d012102377314555a79463834563a5132b73a4eed5230cfd64f324713a329ca4316a258ffffffff99a4129978080da13a80f6ac683e8672655c7f2d4301793d57fbac11b0bf21cc000000006a473044022043be610441ed03f2db27e8b133c608510001f262f3446b29e236f17e5a54b06502206389e2319446105f47c596b311cebe55f10eab26a6c49610ee99e90c7afb0221012102377314555a79463834563a5132b73a4eed5230cfd64f324713a329ca4316a258ffffffff027ac3f381010000001976a914f3b61d5ce671285b82228ac1c03fc6680f2a435b88acf82ff005000000001976a914e73cff340fc96c6960298c1214ce57d053b638ab88ac00000000';
  const placeholderTxId2 = '9c527af56eb1be88b9e336d5369d163e2ac4e5389152af0e4b16d80da8712ff3';
  const placeHolderTxhex2 =
    '0100000002522898374277a2afe45cbb7012432350d0d39e1b2f5b494e02543f8303183a95020000006a4730440220048f9c107bf6f734f1ea2038051612525108ec06787232ea011c382b2f8660c002204f0c20f8f7ee984d4dc95be8a91bfd80dd0f3270fec9b3143173a2055b189c330121025bc22d727141b3c366ac2c3f438775f7024682e6fdbaaa9801b45f67f572415cffffffff7cae8b5adddfa59b45f4020beef146c67e11abfe17e983ed640c5a1736894e40020000006a47304402204f024ba023ddf7e6acfb8f8505be816a8d2edefe1cfc085259f70d3fd8533aa00220112d105228fa58f483a28d0edade809a3be67b75c1d3d9a06fd0aeb47444cf640121025bc22d727141b3c366ac2c3f438775f7024682e6fdbaaa9801b45f67f572415cffffffff027ac3f381010000001976a914e73cff340fc96c6960298c1214ce57d053b638ab88ac722ff7b4000000001976a9142244caa73f879e7b2f494020b26b36b870c4f72588ac00000000';
  const placeholderAddress = 'BRXknAc5gRVSh6Yo3Gs8hgwRPa3mumBwcm';

  const fixSignatures = (psbt: Psbt) => {
    const partialSig = psbt.data.inputs[2].partialSig;
    psbt.finalizeInput(2);
    psbt.data.inputs[2].partialSig = partialSig;

    return psbt.toBase64();
  };

  return useCallback(
    async (inscriptions: { txid: string; vout: number; price: number }[]) => {
      if (!address) return;
      const psbtsToSign: SignPsbtData[] = [];

      for (const inscription of inscriptions) {
        if (!Number.isInteger(inscription.price)) return;
        const sellerOrdUtxoHex = await getTransactionRawHex(inscription.txid);
        if (!sellerOrdUtxoHex) return;
        const sellerPsbt = new Psbt({ network: networks.bitcoin });

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
          value: 0,
        });
        sellerPsbt.addOutput({
          address: placeholderAddress,
          value: 0,
        });
        sellerPsbt.addOutput({
          address: address,
          value: Math.floor(inscription.price) - 1000000,
        });

        psbtsToSign.push({
          options: {
            autoFinalized: false,
            toSignInputs: [
              {
                address,
                index: 2,
                sighashTypes: [Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY],
              },
            ],
          },
          psbtBase64: sellerPsbt.toBase64(),
        });
      }

      const signedListPsbtsBase64: string[] = [];

      if (psbtsToSign.length > 1) {
        const partiallySignedPsbtsBase64 = await signMultiPsbt(psbtsToSign);
        if (!partiallySignedPsbtsBase64) return;
        signedListPsbtsBase64.push(
          ...partiallySignedPsbtsBase64.flatMap((f) => fixSignatures(Psbt.fromBase64(f))),
        );
      } else {
        const partiallySignedPsbtbase64 = await signPsbtInputs(
          psbtsToSign[0].psbtBase64,
          psbtsToSign[0].options,
        );
        if (!partiallySignedPsbtbase64) return;
        const psbt = Psbt.fromBase64(partiallySignedPsbtbase64);
        signedListPsbtsBase64.push(fixSignatures(psbt));
      }

      return signedListPsbtsBase64;
    },
    [address, getTransactionRawHex],
  );
};

export const useCheckInscription = () => {
  const { address } = useNintondoManagerContext();

  return useCallback(
    async (inscription: { number: number; owner: string }): Promise<ApiOrdUTXO | undefined> => {
      if (!address) return;
      const foundInscriptions = await fetchBELLMainnet<ApiOrdUTXO[]>({
        path: `/address/${inscription.owner}/ords?search=${inscription.number}`,
      });
      if (!foundInscriptions || foundInscriptions.length <= 0) return;
      const sellerOrdUtxo = foundInscriptions[0];
      if (!sellerOrdUtxo) {
        toast.error(`Failed to find seller utxo: ${inscription.number}`);
        return;
      }
      sellerOrdUtxo.hex = await getTransactionRawHex(sellerOrdUtxo?.txid);
      return sellerOrdUtxo;
    },
    [address, getTransactionRawHex],
  );
};

export const usePrepareInscriptions = () => {
  const { address } = useNintondoManagerContext();

  return useCallback(
    async (
      data: {
        price: number;
        seller: string;
        sellerUtxo: ApiOrdUTXO;
      }[],
      useRawHex: boolean = false,
    ): Promise<PreparedToBuyInscription[] | undefined> => {
      if (!address) return;
      try {
        const dummyUtxos = await getDummyUTXOS(
          address,
          data.map((f) => f.price + 1000000 + 4000 + gptFeeCalculate(1 + 2, 7, 1000)),
        );
        if (!dummyUtxos) return;

        if (useRawHex) {
          for (const data of dummyUtxos) {
            for (const dummy of data.dummy) {
              dummy.hex = await getTransactionRawHex(dummy.txid);
            }
            for (const pay of data.fee) {
              pay.hex = await getTransactionRawHex(pay.txid);
            }
          }
        }

        const prepared: PreparedToBuyInscription[] = dummyUtxos.map((f, i) => {
          return {
            inscription: { address: data[i].seller, price: data[i].price },
            sellerOrdUtxo: data[i].sellerUtxo,
            utxos: [...f.dummy, ...f.fee],
          };
        });
        return prepared;
      } catch (e) {
        return undefined;
      }
    },
    [address, getTransactionRawHex],
  );
};

export const useCreateBuyingSignedPsbt = () => {
  const { address, signPsbtInputs, signMultiPsbt } = useNintondoManagerContext();

  const fixSignatures = (psbt: Psbt, data: SignPsbtData) => {
    data.options.toSignInputs?.map((f) => psbt.finalizeInput(f.index));
    return psbt.toBase64();
  };

  return useCallback(
    async (datas: PreparedToBuyInscription[], feeRate: number) => {
      if (!address) return;
      if (!Number.isInteger(feeRate)) return;
      const psbtsToSign: SignPsbtData[] = [];
      for (const data of datas) {
        const buyerPsbt = new Psbt({ network: networks.bitcoin });
        buyerPsbt.addInput({
          hash: data.utxos[0].txid,
          index: data.utxos[0].vout,
          nonWitnessUtxo: Buffer.from(data.utxos[0].hex!, 'hex'),
        });
        buyerPsbt.addInput({
          hash: data.utxos[1].txid,
          index: data.utxos[1].vout,
          nonWitnessUtxo: Buffer.from(data.utxos[1].hex!, 'hex'),
        });
        buyerPsbt.addInput({
          hash: data.sellerOrdUtxo.txid,
          index: data.sellerOrdUtxo.vout,
          nonWitnessUtxo: Buffer.from(data.sellerOrdUtxo.hex!, 'hex'),
          sighashType: Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
        });
        const splicedUtxos = data.utxos.splice(0, 2);
        data.utxos.forEach((f) => {
          buyerPsbt.addInput({
            hash: f.txid,
            index: f.vout,
            nonWitnessUtxo: Buffer.from(f.hex!, 'hex'),
          });
        });

        buyerPsbt.addOutput({
          address: address,
          value: splicedUtxos.reduce((acc, val) => (acc += val.value), 0),
        });
        buyerPsbt.addOutput({
          address: address,
          value: data.sellerOrdUtxo.value,
        });
        buyerPsbt.addOutput({
          address: data.inscription.address,
          value: data.inscription.price - 1000000,
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

        const fee = gptFeeCalculate(data.utxos.length + 2, 7, feeRate);

        const change =
          data.utxos.concat(splicedUtxos).reduce((acc, cur) => acc + cur.value, 0) -
          fee -
          splicedUtxos.reduce((acc, sum) => (acc += sum.value), 0) +
          DUMMY_UTXO_VALUE * 2 -
          data.inscription.price -
          0.02 * 10 ** 8;

        if (change <= 0) {
          toast.error('Not enough funds');
          return;
        }

        buyerPsbt.addOutput({
          address: address,
          value: change,
        });

        const inputsToSign = [0, 1, ...data.utxos.map((_, i) => i + 3)];

        psbtsToSign.push({
          psbtBase64: buyerPsbt.toBase64(),
          options: {
            autoFinalized: false,
            toSignInputs: inputsToSign.map((f) => ({
              address,
              index: f,
              sighashTypes: undefined,
            })),
          },
        });
      }

      const signedListPsbtsBase64: string[] = [];

      if (psbtsToSign.length > 1) {
        const partiallySignedPsbtsBase64 = await signMultiPsbt(psbtsToSign);
        if (!partiallySignedPsbtsBase64) return;
        signedListPsbtsBase64.push(
          ...partiallySignedPsbtsBase64.flatMap((f, i) =>
            fixSignatures(Psbt.fromBase64(f), psbtsToSign[i]),
          ),
        );
      } else {
        const partiallySignedPsbtbase64 = await signPsbtInputs(
          psbtsToSign[0].psbtBase64,
          psbtsToSign[0].options,
        );
        if (!partiallySignedPsbtbase64) return;
        const psbt = Psbt.fromBase64(partiallySignedPsbtbase64);
        signedListPsbtsBase64.push(fixSignatures(psbt, psbtsToSign[0]));
      }

      return signedListPsbtsBase64;
    },
    [address, signPsbtInputs],
  );
};

export const getMarketplaceFilters = (searchParams: URLSearchParams) => {
  const rawPage = Number(searchParams.get('page'));
  const rawFilter = searchParams.get('filter') || Object.keys(SORT_FILTERS)[0];

  return {
    tick: searchParams.get('tick') || 'amid',
    page: isNaN(rawPage) || rawPage < 1 ? 1 : rawPage,
    filter: rawFilter in SORT_FILTERS ? rawFilter : Object.keys(SORT_FILTERS)[0],
  };
};

export const useOrdersFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage = Number(searchParams.get('page'));

  const changePage = (page: number) => {
    searchParams.set('page', (page + 1).toString());

    setSearchParams(searchParams);
  };

  const filter = searchParams.get('event');

  return {
    tick: searchParams.get('tick') || 'amid',
    page: isNaN(rawPage) || rawPage < 1 ? 1 : rawPage,
    filter: filter || '' in EVENT_FILTERS ? filter : Object.keys(EVENT_FILTERS).at(0),
    changePage,
  };
};

export const convertOrdersToView = (orders: MarketplaceOrder[]): ItemField[] => {
  return orders.map((order, idx) => ({
    id: { value: idx.toString() },
    txid: { value: shortAddress(order.outpoint), bold: true },
    event: { value: order.event, marked: order.event === 'Listed' },
    // TODO: Add after backend improvement
    price: { value: '8,500', under: '$0.00', additional: 'sats/atom' },
    // TODO: Add after backend improvement
    quantity: { value: '1,517' },
    // TODO: add value in $
    total: { value: order.price.toLocaleString(), under: '$0.00', additional: 'sats' },
    from: { value: shortAddress(order.seller) },
    to: { value: order.receiver ? shortAddress(order.receiver) : '-' },
    time: { value: dayjs.unix(order.date).format('MM/DD/YYYY A hh:mm:ss') },
  }));
};
