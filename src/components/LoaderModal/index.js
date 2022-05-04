import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import OutsideClickHandler from "react-outside-click-handler";
import cn from "classnames";
import styles from "./LoaderModal.module.sass";
import Icon from "../Icon";
import Loader from "../Loader";

const LoaderModal = ({
  visible,
}) => {

  useEffect(() => {
    if (visible) {
      const target = document.querySelector("#modal");
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [visible]);

  return createPortal(
    visible && (
      <div className={styles.modal} id="modal">
        <div className={cn(styles.outer)}>
          <div className={cn(styles.container)}>
            <div className={styles.flex_center}>
              <Loader />
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

export default LoaderModal;
