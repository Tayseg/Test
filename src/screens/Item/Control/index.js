import React, { useState } from "react";
import cn from "classnames";
import { useSelector } from "react-redux";
import styles from "./Control.module.sass";
import Checkout from "./Checkout";
import Modal from "../../../components/Modal";
import ModalSaleForBuyNow from "./ModalSaleForBuyNow";
import ModalConfirm from "../../../components/ModalConfirm";
import LoaderModal from '../../../components/LoaderModal';

const Control = ({ nftData }) => {
  const user = useSelector((state) => state.user);
  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalSaleForBuyNow, setVisibleModalSaleForBuyNow] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const cancelSale = () => {
    setLoading(true);
    
    setLoading(false);
    setVisibleModalConfirm(false);
  };

  return (
    <>
      <div>
        {
          user ? user.address === nftData.ownerAccount ?
            nftData.onSale ? (
              <div className={styles.foot}>
                <button
                  className={cn("button", styles.button)}
                  onClick={() => setVisibleModalConfirm(true)}
                >
                  Cancel sale
                </button>
              </div>
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
                </div>
              </div>
            ) : (<></>) : (<></>)
        }
      </div>
      <ModalConfirm
        visible={visibleModalConfirm}
        onClose={() => setVisibleModalConfirm(false)}
        message="Do you wanna cancel the sale of this NFT really?"
        action={cancelSale}
      />
      <Modal
        visible={visibleModalPurchase}
        onClose={() => setVisibleModalPurchase(false)}
      >
        <Checkout nftData={nftData} />
      </Modal>
      <Modal visible={visibleModalSaleForBuyNow} onClose={() => setVisibleModalSaleForBuyNow(false)}>
        <ModalSaleForBuyNow nftData={nftData} />
      </Modal>
      <LoaderModal visible={loading} />
    </>
  );
};

export default Control;
