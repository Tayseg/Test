import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useParams } from "react-router-dom";
import { useMoralis } from "react-moralis";
import styles from "./Item.module.sass";
// import Users from "./Users";
import Control from "./Control";
// import Options from "./Options";
import { MORALIS_APP_ID, MORALIS_SERVER_URL } from "../../utils/constants";
import Loader from "../../components/Loader";

// const navLinks = ["Info", "Bids"];

// const users = [
//   {
//     name: "Raquel Will",
//     position: "Owner",
//     avatar: "/images/content/avatar-2.jpg",
//     reward: "/images/content/reward-1.svg",
//   },
//   {
//     name: "Selina Mayert",
//     position: "Creator",
//     avatar: "/images/content/avatar-1.jpg",
//   },
// ];

const Item = () => {
  const { Moralis } = useMoralis();
  const { address, tokenId } = useParams();
  // const [activeIndex, setActiveIndex] = useState(0);
  const [nftData, setNftData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Moralis.start({ serverUrl: MORALIS_SERVER_URL, appId: MORALIS_APP_ID });

      //  Check that whether the NFT was minted on our marketplace or imported from outside
      const ImportedCollections = Moralis.Object.extend('ImportedCollections');
      const queryOfImportedCollections = new Moralis.Query(ImportedCollections);
      queryOfImportedCollections.equalTo('contractAddress', address);
      const responseOfImportedCollections = await queryOfImportedCollections.find();

      //  If this is one of an imported collection
      if (responseOfImportedCollections.length > 0) {
        //  To be added when import collection is been handling
      } else {
        //  If this was minted on our marketplace.
        const Items = Moralis.Object.extend('Items');
        const queryOfItems = new Moralis.Query(Items);
        queryOfItems.equalTo('tokenId', Number(tokenId));
        const responseOfItems = await queryOfItems.find();

        if (responseOfItems.length === 1) {
          const { id, attributes } = responseOfItems[0];

          //  Fetch the metadata of NFT to get image url
          fetch(attributes.tokenUri)
            .then(res => res.json())
            .then(data => {
              setNftData({
                objectId: id,
                ...attributes,
                image: data.image
              });
            });

          //  Get the data of the owner of the NFT
          // const resultOfUser = await Moralis.Cloud.run(
          //   'getUserDataByOwnerAccount',
          //   { ownerAccount: attributes.ownerAccount }
          // );

          // console.log('# resultOfUser: ', resultOfUser);

          // setUserData(resultOfUser);
          const responseOfUser = Moralis.User.current();
          console.log('# responseOfUser: ', responseOfUser);
        }
      }
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <div className={cn("section", styles.section)}>
        {
          loading ? (
            <div className={styles.flexRowCenter}>
              <Loader />
            </div>
          ) : (
            <div className={cn("container", styles.container)}>
              <div className={styles.bg}>
                <div className={styles.preview}>
                  {/* <div className={styles.categories}>
                  {categories.map((x, index) => (
                    <div
                      className={cn(
                        { "status-black": x.category === "black" },
                        { "status-purple": x.category === "purple" },
                        styles.category
                      )}
                      key={index}
                    >
                      {x.content}
                    </div>
                  ))}
                </div> */}
                  <img
                    src={nftData ? nftData.image : '/images/content/follower-pic-2.jpg'}
                    alt="Item"
                  />
                </div>
                {/* <Options className={styles.options} /> */}
              </div>
              <div className={styles.details}>
                <h1 className={cn("h3", styles.title)}>{nftData?.name}</h1>
                <div className={styles.cost}>
                  <div className={cn("status-stroke-green", styles.price)}>
                    {nftData?.price} TFUEL
                  </div>
                  {/* <div className={cn("status-stroke-black", styles.price)}>
                  $4,429.87
                </div> */}
                </div>
                <div className={styles.info}>
                  {nftData?.description}
                </div>

                {/* <div className={styles.user}>
                  <div className={styles.avatar}>
                    <img src={userData.avatar} alt="Avatar" />
                  </div>
                  <div className={styles.description}>
                    <div className={styles.name}>{userData.displayName}</div>
                    <div className={styles.money}>
                      {userData.bio}
                    </div>
                  </div>
                </div> */}

                {/* <div className={styles.nav}>
                  {navLinks.map((x, index) => (
                    <button
                      className={cn(
                        { [styles.active]: index === activeIndex },
                        styles.link
                      )}
                      onClick={() => setActiveIndex(index)}
                      key={index}
                    >
                      {x}
                    </button>
                  ))}
                </div> */}
                {/* <Users className={styles.users} items={users} /> */}
                {nftData && <Control className={styles.control} nftData={nftData} />}
              </div>
            </div>
          )
        }

      </div>
    </>
  );
};

export default Item;
