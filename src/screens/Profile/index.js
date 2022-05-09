import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Profile.module.sass";
import Icon from "../../components/Icon";
import User from "./User";
import Items from "./Items";
import { useMoralis } from "react-moralis";
import LoaderModal from "../../components/LoaderModal";
import { useParams } from "react-router-dom";
import { MORALIS_APP_ID, MORALIS_SERVER_URL } from "../../utils/constants";

const socials = [
  {
    title: "twitter",
    url: "https://twitter.com/ui8",
  },
  {
    title: "instagram",
    url: "https://www.instagram.com/ui8net/",
  },
  {
    title: "facebook",
    url: "https://www.facebook.com/ui8.net/",
  },
];

const Profile = () => {
  const { Moralis } = useMoralis();
  const { address } = useParams();
  const [visible, setVisible] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Moralis.start({ serverUrl: MORALIS_SERVER_URL, appId: MORALIS_APP_ID });
        /* ----------  Get the data of the user ---------- */
        const Users = Moralis.Object.extend('Users');
        const query = new Moralis.Query(Users);

        query.equalTo('walletAddress', address);
        const { id, attributes } = await query.first();

        setUserData({
          objectId: id,
          ...attributes
        });
        /* --------------------------------------------- */

        //  Get NFTs of this user
        console.log('### address => ', typeof address);
        const results = await Moralis.Cloud.run('getNftsByOwner', { ownerAccount: address });
        console.log('# results: ', results);

        setNfts(results);
        setLoading(false);
      } catch (error) {
        console.log('# error: ', error);
      }
    })();
  }, []);

  return (
    <div className={styles.profile}>
      <div
        className={cn(styles.head, { [styles.active]: visible })}
        style={{
          backgroundImage: "url(/images/content/bg-profile.jpg)",
        }}
      >
        <div className={cn("container", styles.container)}>
          <div className={styles.btns}>
            <button
              className={cn("button-stroke button-small", styles.button)}
              onClick={() => setVisible(true)}
            >
              <span>Edit cover photo</span>
              <Icon name="edit" size="16" />
            </button>
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to={`/user/${address}/edit`}
            >
              <span>Edit profile</span>
              <Icon name="image" size="16" />
            </Link>
          </div>
          <div className={styles.file}>
            <input type="file" />
            <div className={styles.wrap}>
              <Icon name="upload-file" size="48" />
              <div className={styles.info}>Drag and drop your photo here</div>
              <div className={styles.text}>or click to browse</div>
            </div>
            <button
              className={cn("button-small", styles.button)}
              onClick={() => setVisible(false)}
            >
              Save photo
            </button>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={cn("container", styles.container)}>
          <User className={styles.user} item={socials} userData={userData} />
          <div className={styles.wrapper}>
            <div className={styles.group}>
              <div className={styles.item}>
                {nfts.length > 0 && <Items class={styles.items} items={nfts} pageName="profile" />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoaderModal visible={loading} />
    </div>
  );
};

export default Profile;
