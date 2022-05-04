import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useHistory } from "react-router-dom";
import styles from "./Checkout.module.sass";
// import Icon from "../../../../components/Icon";
// import LoaderCircle from "../../../../components/LoaderCircle";
import { useDispatch, useSelector } from "react-redux";
import { useMoralis, useNativeBalance } from "react-moralis";
import { CONTRACT_ABI, CONTRACT_ADDRESS, FEE_DENOMINATOR, LOCALSTORAGE_USER } from "../../../../utils/constants";
import LoaderModal from "../../../../components/LoaderModal";
import { updateUser } from "../../../../redux/features/user";

const Checkout = ({ className, nftData }) => {
  const { Moralis } = useMoralis();
  const { getBalances } = useNativeBalance();
  const { address, balance } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const { objectId, price, ownerAccount, saleType, tokenId } = nftData;
  const [feePercentage, setFeePercentage] = useState(0);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleBuy = async () => {
    setLoading(true);
    if (balance > totalPrice) {
      try {
        // In smart contract
        await Moralis.enableWeb3();
        const transaction = await Moralis.executeFunction({
          contractAddress: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'buyTokenOnFixed',
          params: {
            tokenId: nftData.tokenId
          },
          msgValue: Moralis.Units.ETH(String(totalPrice))
        });

        await transaction.wait();

        //  Change the owner of NFT in Moralis DB
        const Items = Moralis.Object.extend('Items');
        const query = new Moralis.Query(Items);

        query.equalTo('objectId', objectId);
        const item = await query.first();
        item.set('onSale', false);
        item.set('saleType', null);
        item.set('ownerAccount', address);
        await item.save();

        //  Leave the log of this transaction
        const SaleLogs = Moralis.Object.extend('SaleLogs');
        const saleLog = new SaleLogs();

        saleLog.set('tokenId', tokenId);
        saleLog.set('sellerAccount', ownerAccount);
        saleLog.set('buyerAccount', address);
        saleLog.set('price', price);
        saleLog.set('saleType', saleType);

        await saleLog.save();

        //  Update the current balance of wallet
        const balanceData = await getBalances();
        const balance = Number(balanceData.balance) * Math.pow(10, -18);
        const userData = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER));

        userData.balance = balance;
        console.log('# userData: ', userData);
        localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));
        dispatch(updateUser(userData));

        alert('Success.');
      } catch (error) {
        console.log('# error: ', error);
        if (error.code === -32603) {
          alert(error.message);
        }
      }
    } else {
      alert("Your balance isn't enough.");
    }
    setLoading(false);
    history.push('/search01');
  };

  useEffect(() => {
    (async () => {
      const Items = Moralis.Object.extend('Items');
      const query = new Moralis.Query(Items);

      query.equalTo('objectId', objectId);
      const { attributes: { royalty } } = (await query.find())[0];

      setFeePercentage(royalty);
    })();
  }, []);

  useEffect(() => {
    const _fee = Number((price * feePercentage / FEE_DENOMINATOR).toFixed(8));
    setFee(price * feePercentage / FEE_DENOMINATOR);
    setTotalPrice(_fee + price);
  }, [feePercentage, price]);


  return (
    <div className={cn(className, styles.checkout)}>
      <div className={cn("h4", styles.title)}>Checkout</div>
      {/* <div className={styles.info}>
        You are about to purchase <strong>C O I N Z</strong> from{" "}
        <strong>UI8</strong>
      </div> */}
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.col}>Total</div>
          <div className={styles.col}>{totalPrice} TFUEL</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>Price</div>
          <div className={styles.col}>{nftData.price} TFUEL</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>Fee</div>
          <div className={styles.col}>{fee} TFUEL</div>
        </div>
      </div>
      {/* <div className={styles.attention}>
        <div className={styles.preview}>
          <Icon name="info-circle" size="32" />
        </div>
        <div className={styles.details}>
          <div className={styles.subtitle}>This creator is not verified</div>
          <div className={styles.text}>Purchase this item at your own risk</div>
        </div>
      </div>
      <div className={cn("h4", styles.title)}>Follow steps</div>
      <div className={styles.line}>
        <div className={styles.icon}>
          <LoaderCircle className={styles.loader} />
        </div>
        <div className={styles.details}>
          <div className={styles.subtitle}>Purchasing</div>
          <div className={styles.text}>
            Sending transaction with your wallet
          </div>
        </div>
      </div>
      <div className={styles.attention}>
        <div className={styles.preview}>
          <Icon name="info-circle" size="32" />
        </div>
        <div className={styles.details}>
          <div className={styles.subtitle}>This creator is not verified</div>
          <div className={styles.text}>Purchase this item at your own risk</div>
        </div>
        <div className={styles.avatar}>
          <img src="/images/content/avatar-3.jpg" alt="Avatar" />
        </div>
      </div> */}
      <div className={styles.btns}>
        <button className={cn("button", styles.button)} onClick={handleBuy}>
          Buy
        </button>
        {/* <button className={cn("button-stroke", styles.button)}>Cancel</button> */}
      </div>
      <LoaderModal visible={loading} />
    </div>
  );
};

export default Checkout;
