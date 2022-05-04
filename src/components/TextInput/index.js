import React from "react";
import cn from "classnames";
import styles from "./TextInput.module.sass";

const TextInput = ({ className, label, register, name, ...props }) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        {
          register ? (
            <input className={styles.input} {...register(name)} {...props} />
          ) : (
            <input className={styles.input} {...props} />
          )
        }

      </div>
    </div>
  );
};

export default TextInput;
