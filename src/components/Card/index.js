import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
import styles from "./Card.module.sass";
// import Icon from "../Icon";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import Loader from "../Loader";

const Card = ({ className, item }) => {
  // const [visible, setVisible] = useState(false);
  const [metadata, setMetadata] = useState(null);
  // const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(item.tokenUri)
      .then(response => response.json())
      .then(data => {
        setMetadata(data);
        setLoading(false);
      });
  }, [item.objectId]);

  return (
    <div className={cn(styles.card, className)}>
      {
        loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <div className={styles.preview}>
            <img src={metadata ? metadata.image : '/images/content/follower-pic-2.jpg'} alt="Card" />
            {/* {

              user ? item.ownerAccount !== user.address ? (
                <div className={styles.control}>
                  {
                    item.category && (
                      <div
                        className={cn(
                          { "status-green": item.category === "green" },
                          styles.category
                        )}
                      >
                        {item.categoryText}
                      </div>
                    )
                  }

                  <button
                    className={cn(styles.favorite, { [styles.active]: visible })}
                    onClick={() => setVisible(!visible)}
                  >
                    <Icon name="heart" size="20" />
                  </button>

                  <button className={cn("button-small", styles.button)}>
                    <span>Place a bid</span>
                    <Icon name="scatter-up" size="16" />
                  </button>

                </div>
              ) : (<></>) : (<></>)
            } */}
          </div>
        )
      }
      <Link className={styles.link} to={`/nft/${CONTRACT_ADDRESS}/${item.tokenId}`}>
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{item.name}</div>
            <div className={styles.price}>{item.price} TFUEL</div>
          </div>

          {/* {
            pageName !== 'profile' && (
              <div className={styles.line}>
                <div className={styles.users}>
                  {item.users.map((x, index) => (
                    <div className={styles.avatar} key={index}>
                      <img src={x.avatar} alt="Avatar" />
                    </div>
                  ))}
                </div>
                <div className={styles.counter}>{item.counter}</div>
              </div>
            )
          } */}
        </div>
        {/* {
          pageName !== 'profile' && (
            <div className={styles.foot}>
              <div className={styles.status}>
                <Icon name="candlesticks-up" size="20" />
                Highest bid <span>{item.highestBid}</span>
              </div>
              <div
                className={styles.bid}
                dangerouslySetInnerHTML={{ __html: item.bid }}
              />
            </div>
          )
        } */}
      </Link>
    </div>
  );
};

export default Card;
