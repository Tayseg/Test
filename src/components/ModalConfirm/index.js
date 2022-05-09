import React from 'react';
import cn from "classnames";
import Modal from '../Modal';
import styles from "./ModalConfirm.module.sass";

const ModalConfirm = ({ className, visible, onClose, message, action }) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <div className={cn(className, styles.checkout)}>
        <div className={cn("h4", styles.title)}>Are you sure?</div>
        <div className={cn("p", styles.text)}>{message}</div>
        <div className={styles.btns}>
          <button className={cn("button", styles.button)} onClick={action}>Yes</button>
          <button className={cn("button-stroke", styles.button)} onClick={onClose}>No</button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;