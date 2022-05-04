import React, { useState } from "react";
import cn from "classnames";
import { useSelector } from "react-redux";
import styles from "./Control.module.sass";
import Checkout from "./Checkout";
import Connect from "../../../components/Connect";
import Bid from "../../../components/Bid";
import Accept from "./Accept";
import PutSale from "./PutSale";
// import SuccessfullyPurchased from "./SuccessfullyPurchased";
import Modal from "../../../components/Modal";
import ModalSaleForBuyNow from "./ModalSaleForBuyNow";

const Control = ({ className, nftData }) => {
  const user = useSelector((state) => state.user);
  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [visibleModalSaleForBuyNow, setVisibleModalSaleForBuyNow] = useState(false);

  return (
    <>
      {/* <div className={cn(styles.control, className)}> */}
      <div>
        {/* <div className={styles.head}>
          <div className={styles.avatar}>
            <img src="/images/content/avatar-4.jpg" alt="Avatar" />
          </div>
          <div className={styles.details}>
            <div className={styles.info}>
              Highest bid by <span>Kohaku Tora</span>
            </div>
            <div className={styles.cost}>
              <div className={styles.price}>1.46 TFUEL</div>
              <div className={styles.price}>$2,764.89</div>
            </div>
          </div>
        </div> */}
        {
          user ? user.address === nftData.ownerAccount ?
            nftData.onSale ? (
              // <div className={styles.btns}>
              //   <button className={cn("button-stroke", styles.button)}>
              //     View all
              //   </button>
              //   <button
              //     className={cn("button", styles.button)}
              //     onClick={() => setVisibleModalAccept(true)}
              //   >
              //     Accept
              //   </button>
              // </div>
              <></>
            ) : (
              <>
                <div className={styles.foot}>
                  <button
                    className={cn("button", styles.button)}
                    onClick={() => setVisibleModalSaleForBuyNow(true)}
                  >
                    Put on sale
                  </button>
                </div>
                <div className={styles.note}>
                  You can sell this token on our Marketplace
                </div>
              </>
            ) : nftData.onSale ? (
              <div>
                <div className={styles.btns}>
                  <button
                    className={cn("button", styles.button)}
                    onClick={() => setVisibleModalPurchase(true)}
                  >
                    Purchase now
                  </button>
                  {/* <button
                    className={cn("button-stroke", styles.button)}
                    onClick={() => setVisibleModalBid(true)}
                  >
                    Place a bid
                  </button> */}
                </div>
                {/* <div className={styles.text}>
                  Service fee <span className={styles.percent}>1.5%</span>{" "}
                  <span>2.563 TFUEL</span> <span>$4,540.62</span>
                </div> */}
              </div>
            ) : (<></>) : (<></>)
        }
      </div>
      <Modal
        visible={visibleModalPurchase}
        onClose={() => setVisibleModalPurchase(false)}
      >
        <Checkout nftData={nftData} />
        {/* <SuccessfullyPurchased /> */}
      </Modal>
      <Modal
        visible={visibleModalBid}
        onClose={() => setVisibleModalBid(false)}
      >
        <Connect />
        <Bid />
      </Modal>
      <Modal
        visible={visibleModalAccept}
        onClose={() => setVisibleModalAccept(false)}
      >
        <Accept />
      </Modal>
      <Modal
        visible={visibleModalSale}
        onClose={() => setVisibleModalSale(false)}
      >
        <PutSale />
      </Modal>
      <Modal visible={visibleModalSaleForBuyNow} onClose={() => setVisibleModalSaleForBuyNow(false)}>
        <ModalSaleForBuyNow nftData={nftData} />
      </Modal>
    </>
  );
};

export default Control;
