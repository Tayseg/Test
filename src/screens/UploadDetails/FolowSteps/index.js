import React from "react";
import cn from "classnames";
import styles from "./FolowSteps.module.sass";
import Icon from "../../../components/Icon";
import Loader from "../../../components/Loader";
import LoaderCircle from "../../../components/LoaderCircle";

const FolowSteps = ({ className, handleCreateSingleItem }) => {
  return (
    <div className={cn(className, styles.steps)}>
      <div className={cn("h4", styles.title)}>Really?</div>
      <div className={styles.list}>
        <div className={styles.item}>
          <button className={cn("button", styles.button)} onClick={handleCreateSingleItem}>Start now</button>
        </div>
      </div>
    </div>
  );
};

export default FolowSteps;
