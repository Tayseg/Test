import React, { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./User.module.sass";
import Icon from "../../Icon";
import Theme from "../../Theme";
import { useDispatch, useSelector } from "react-redux";
// import { useMoralis } from "react-moralis";
import { updateUser } from "../../../redux/features/user";
import { LOCALSTORAGE_USER } from "../../../utils/constants";

const User = ({ className, deactivate }) => {
  const [visible, setVisible] = useState(false);
  // const { logout } = useMoralis();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const items = [
    // {
    //   title: "My profile",
    //   icon: "user",
    //   url: `/user/${user?.address}`,
    // },
    {
      title: "Dark theme",
      icon: "bulb",
    },
    {
      title: "Disconnect",
      icon: "exit",
      url: "/",
      onClick: () => {
        // logout();
        deactivate();
        localStorage.removeItem(LOCALSTORAGE_USER);
        dispatch(updateUser(null));
      },
    },
  ];

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.user, className)}>
        <div className={styles.head} onClick={() => setVisible(!visible)}>
          <div className={styles.avatar}>
            <img
              src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
              alt="Avatar"
            />
          </div>
          <div className={styles.wallet}>
            {`${user.balance}`.slice(0, 6)}{" "}
            <span className={styles.currency}>TFUEL</span>
          </div>
        </div>
        {visible && (
          <div className={styles.body}>
            {/*<div className={styles.name}>Enrico Cole</div>*/}
            <div className={styles.code}>
              <div className={styles.number}>
                {user.address
                  ? `${user.address.slice(0, 14)}...${user.address.slice(-4)}`
                  : ""}
              </div>
              <button className={styles.copy}>
                <Icon name="copy" size="16" />
              </button>
            </div>
            <div className={styles.wrap}>
              <div className={styles.line}>
                <div className={styles.preview}>
                  <img
                    src="/images/content/etherium-circle.jpg"
                    alt="Ethereum"
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.info}>Balance</div>
                  <div className={styles.price}>
                    {`${user.balance}`.slice(0, 6)} TFUEL
                  </div>
                </div>
              </div>
              {/*<button*/}
              {/*  className={cn("button-stroke button-small", styles.button)}*/}
              {/*>*/}
              {/*  Manage fun on Coinbase*/}
              {/*</button>*/}
            </div>
            <div className={styles.menu}>
              {items.map((x, index) =>
                x.url ? (
                  x.url.startsWith("http") ? (
                    <a
                      className={styles.item}
                      href={x.url}
                      rel="noopener noreferrer"
                      key={index}
                    >
                      <div className={styles.icon}>
                        <Icon name={x.icon} size="20" />
                      </div>
                      <div className={styles.text}>{x.title}</div>
                    </a>
                  ) : (
                    <Link
                      className={styles.item}
                      to={x.url}
                      onClick={() => {
                        if (x.onClick) x.onClick();
                        setVisible(!visible);
                      }}
                      key={index}
                    >
                      <div className={styles.icon}>
                        <Icon name={x.icon} size="20" />
                      </div>
                      <div className={styles.text}>{x.title}</div>
                    </Link>
                  )
                ) : (
                  <div className={styles.item} key={index}>
                    <div className={styles.icon}>
                      <Icon name={x.icon} size="20" />
                    </div>
                    <div className={styles.text}>{x.title}</div>
                    <Theme className={styles.theme} />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default User;
