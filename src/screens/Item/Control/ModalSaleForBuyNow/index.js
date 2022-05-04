import React, { useState, useEffect } from "react";
import cn from "classnames";
import { useDispatch, useSelector } from 'react-redux';
import { useMoralis, useNativeBalance } from 'react-moralis';
import { useHistory } from "react-router-dom";
import styles from "./ModalSaleForBuyNow.module.sass";
import {
  CHAIN,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  FEE_DENOMINATOR,
  LOCALSTORAGE_USER,
  SALE_TYPE_BUY_NOW
} from "../../../../utils/constants";
import LoaderModal from "../../../../components/LoaderModal";
import { updateUser } from "../../../../redux/features/user";

export default function ModalSaleForBuyNow({ className, nftData }) {
  const { balance } = useSelector((state) => state.user);
  const { Moralis } = useMoralis();
  const { getBalances } = useNativeBalance({ chain: CHAIN });
  const dispatch = useDispatch();
  const history = useHistory();
  const { tokenId, objectId } = nftData;
  const [price, setPrice] = useState(0);
  const [feePercentage, setFeePercentage] = useState(0);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSell = async () => {
    setLoading(true);
    if (balance > fee) {
      try {
        console.log('# fee: ', Moralis.Units.ETH(String(fee)));
        //  Smart contract
        const transaction = await Moralis.executeFunction({
          contractAddress: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'setTokenOnSale',
          params: {
            tokenId,
            _price: Moralis.Units.ETH(price)
          },
          msgValue: Moralis.Units.ETH(String(fee))
        });

        await transaction.wait();

        //  Update the data of NFT on Moralis DB
        const Items = Moralis.Object.extend('Items');
        const query = new Moralis.Query(Items);

        query.equalTo('objectId', objectId);

        const item = await query.first();
        item.set('onSale', true);
        item.set('price', Number(price));
        item.set('saleType', SALE_TYPE_BUY_NOW);
        await item.save();

        //  Update the current balance of wallet
        const balanceData = await getBalances();
        const balance = Number(balanceData.balance) * Math.pow(10, -18);
        const userData = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER));

        userData.balance = balance;
        console.log('# userData: ', userData);
        localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));
        dispatch(updateUser(userData));

        alert('Success.');
        history.push('/search01');
      } catch (error) {
        console.log('# error: ', error);
      }
    } else {
      alert("Your balance isn't enough to pay the fee.");
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await Moralis.enableWeb3();
      const _feePercentage = await Moralis.executeFunction({
        contractAddress: CONTRACT_ADDRESS,
        functionName: 'getFeePercentageForSeller',
        abi: CONTRACT_ABI
      });
      setFeePercentage(_feePercentage);
    })();
  }, []);

  useEffect(() => {
    const _fee = Number((price * feePercentage / FEE_DENOMINATOR).toFixed(8));
    setFee(_fee);
  }, [feePercentage, price]);

  return (
    <div className={cn(className, styles.sale)}>
      <div className={cn("h4", styles.title)}>Put on sale</div>
      <div className={styles.mt_sm}>
        <div className={styles.label}>Price</div>
        <input
          className={styles.input}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          name="name"
          placeholder="Type here..."
          min={0}
          required
        />
      </div>
      <button
        className={cn("button", styles.button, styles.mt_xs)}
        onClick={handleSell}
      >
        Sell
      </button>
      <div className={styles.info}>
        You should pay <span>{fee} TFUEL</span> as fee.
      </div>
      <LoaderModal visible={loading} />
    </div>
  );
}