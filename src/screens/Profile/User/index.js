import React from "react";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";
// import Report from "../../../components/Report";
// import Modal from "../../../components/Modal";
// import { FacebookShareButton, TwitterShareButton } from "react-share";
import { useSelector } from "react-redux";
// import { isStepDivisible } from "react-range/lib/utils";

// const shareUrlFacebook = "https://ui8.net";
// const shareUrlTwitter = "https://ui8.net";

const User = ({ className, userData }) => {
  // const [visible, setVisible] = useState(false);
  // const [visibleShare, setVisibleShare] = useState(false);
  // const [visibleModalReport, setVisibleModalReport] = useState(false);

  const user = useSelector((state) => state.user);

  return (
    <>
      <div className={cn(styles.user, className)}>
        {
          userData?.avatar && (
            <div className={styles.avatar}>
              <img src={userData?.avatar} alt="Avatar" />
            </div>
          )
        }

        {
          userData?.displayName && (
            <div className={styles.name}>{ userData?.displayName }</div>
          )
        }
        <div className={styles.code}>
          <div className={styles.number}>
            {user?.address
              ? `${user.address.slice(0, 4)}...${user.address.slice(-4)}`
              : ""}
          </div>
          <button className={styles.copy}>
            <Icon name="copy" size="16" />
          </button>
        </div>
        {
          userData?.bio && (
            <div className={styles.info}>
              {userData?.bio}
            </div>
          )
        }
        {/* <a
          className={styles.site}
          href="https://ui8.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="globe" size="16" />
          <span>https://ui8.net</span>
        </a>
        <div className={styles.control}>
          <div className={styles.btns}>
            <button
              className={cn(
                "button button-small",
                { [styles.active]: visible },
                styles.button
              )}
              onClick={() => setVisible(!visible)}
            >
              <span>Follow</span>
              <span>Unfollow</span>
            </button>
            <button
              className={cn(
                "button-circle-stroke button-small",
                { [styles.active]: visibleShare },
                styles.button
              )}
              onClick={() => setVisibleShare(!visibleShare)}
            >
              <Icon name="share" size="20" />
            </button>
            <button
              className={cn("button-circle-stroke button-small", styles.button)}
              onClick={() => setVisibleModalReport(true)}
            >
              <Icon name="report" size="20" />
            </button>
          </div>
          <div className={cn(styles.box, { [styles.active]: visibleShare })}>
            <div className={styles.stage}>Share link to this page</div>
            <div className={styles.share}>
              <TwitterShareButton
                className={styles.direction}
                url={shareUrlTwitter}
              >
                <span>
                  <Icon name="twitter" size="20" />
                </span>
              </TwitterShareButton>
              <FacebookShareButton
                className={styles.direction}
                url={shareUrlFacebook}
              >
                <span>
                  <Icon name="facebook" size="20" />
                </span>
              </FacebookShareButton>
            </div>
          </div>
        </div>
        <div className={styles.socials}>
          {item.map((x, index) => (
            <a
              className={styles.social}
              href={x.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
            >
              <Icon name={x.title} size="20" />
            </a>
          ))}
        </div>
        <div className={styles.note}>Member since Mar 15, 2021</div> */}
      </div>
      {/* <Modal
        visible={visibleModalReport}
        onClose={() => setVisibleModalReport(false)}
      >
        <Report />
      </Modal> */}
    </>
  );
};

export default User;
