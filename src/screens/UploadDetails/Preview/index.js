import React from "react";
import cn from "classnames";
import { useWatch } from "react-hook-form";
import styles from "./Preview.module.sass";
import Icon from "../../../components/Icon";

const Preview = ({ className, onClose, imageFile, control, clearData }) => {
  const { item_name, description, property, size } = useWatch({ control });

  return (
    <div className={cn(className, styles.wrap)}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>
          <Icon name="close" size="14" />
        </button>
        <div className={styles.info}>Preview</div>
        <div className={styles.card}>
          <div className={styles.preview}>
            {
              imageFile && (<img
                src={imageFile && imageFile.source}
                alt="Card"
              />)
            }
          </div>
          <div className={styles.link}>
            <div className={styles.body}>
              <div className={styles.line}>
                <div className={styles.title}>
                  Name: {item_name}
                </div>
              </div>

              <div className={styles.line}>
                <div className={styles.title}>
                  Description: {description}
                </div>
              </div>

              {/* <div className={styles.line}>
                <div className={styles.title}>
                  Royalty: {royalties}
                </div>
              </div> */}

              <div className={styles.line}>
                <div className={styles.title}>
                  Size: {size}
                </div>
              </div>

              <div className={styles.line}>
                <div className={styles.title}>
                  Propertie: {property}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className={styles.clear}
          onClick={() => {
            clearData();
          }}
        >
          <Icon name="circle-close" size="24" />
          Clear all
        </button>
      </div>
    </div>
  );
};

export default Preview;
