import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import { useMoralis } from "react-moralis";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from '@web3-react/core';
import styles from "./Header.module.sass";
import Icon from "../Icon";
import Image from "../Image";
import Notification from "./Notification";
import User from "./User";
import { updateUser } from "../../redux/features/user";
import {
  LOCALSTORAGE_USER,
  CHAIN_ID,
  SWITCH_ERROR_CODE,
  CHAIN_NAME,
  RPC_URLS,
  BLOCK_EXPLORER_URLS,
  NATIVE_CURRENCY_NAME,
  NATIVE_CURRENCY_SYMBOL,
  DECIMALS
} from "../../utils/constants";
import LoaderModal from "../LoaderModal";
import { injected } from "../../utils/connectors";
import { isNoEthereumObject } from "../../utils/errors";

const nav = [
  {
    url: "/search01",
    title: "Discover",
  },
  // {
  //   url: "/faq",
  //   title: "How it work",
  // },
  // {
  //   url: "/item",
  //   title: "Create item",
  // },
  // {
  //   url: "/profile",
  //   title: "Profile",
  // },
];

const Headers = () => {
  const { Moralis } = useMoralis();
  const { activate, deactivate, account, chainId } = useWeb3React();
  const [visibleNav, setVisibleNav] = useState(false);
  const [search, setSearch] = useState("");
  const [searchedNfts, setSearchedNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    alert();
  };

  //  Connect wallet
  const connectWallet = async () => {
    await activate(injected, (error) => {
      if (isNoEthereumObject(error))
        window.open("https://metamask.io/download.html");
    });
  };

  //  Search NFTs
  const handleSearch = async (searchKey) => {
    setSearch(searchKey);

    const Items = Moralis.Object.extend('Items');
    const query = new Moralis.Query(Items);

    query.equalTo('name', { $regex: searchKey, $options: 'i' });
    query.descending('createdAt');

    const response = await query.find();
    const results = response.map(resItem => {
      const nftItem = { objectId: resItem.id, ...resItem.attributes };
      return nftItem;
    });
    setSearchedNfts(results);
  };

  const isRegisteredUser = async (address) => {
    const Users = Moralis.Object.extend('Users');
    const query = new Moralis.Query(Users);
    query.equalTo('walletAddress', address.toLowerCase());

    const _users = await query.find();

    if (_users.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const registerUser = async (address) => {
    const Users = Moralis.Object.extend('Users');
    const user = new Users();

    user.set('walletAddress', address.toLowerCase());

    await user.save();
  };

  const getBalance = async (address) => {
    const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] });
    const wei = parseInt(balance, 16);
    const eth = (wei / Math.pow(10, 18));

    return eth;
  };

  //  Switch network
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (chainId && account) {
        if (Number(chainId) !== CHAIN_ID) {
          if (window.ethereum) {
            //  If the current network isn't the expected one, switch it to the expected one.
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
              });

              // Get balance and register user if he/she connects wallet firstly
              const balance = await getBalance(account);

              const isExisted = await isRegisteredUser(account);
              if (!isExisted) {
                registerUser(account);
              }

              const userData = {
                address: account.toLowerCase(),
                balance
              };
              localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));
              dispatch(updateUser(userData));

            } catch (switchError) {
              //  If the expected network isn't existed in the metamask.
              if (switchError.code === SWITCH_ERROR_CODE) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${CHAIN_ID.toString(16)}`,
                      chainName: CHAIN_NAME,
                      rpcUrls: RPC_URLS,
                      blockExplorerUrls: BLOCK_EXPLORER_URLS,
                      nativeCurrency: {
                        name: NATIVE_CURRENCY_NAME,
                        symbol: NATIVE_CURRENCY_SYMBOL, // 2-6 characters length
                        decimals: DECIMALS,
                      }
                    },
                  ],
                });

                // Get balance and register user if he/she connects wallet firstly
                const balance = await getBalance(account);

                const isExisted = await isRegisteredUser(account);
                if (!isExisted) {
                  registerUser(account);
                }

                const userData = {
                  address: account.toLowerCase(),
                  balance
                };
                localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));
                dispatch(updateUser(userData));
              }
            }
          }
        } else {
          // Get balance and register user if he/she connects wallet firstly
          const balance = await getBalance(account);

          const isExisted = await isRegisteredUser(account);
          if (!isExisted) {
            registerUser(account);
          }

          const userData = {
            address: account.toLowerCase(),
            balance
          };
          localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));
          dispatch(updateUser(userData));
        }
      }
      setLoading(false);
    })();
  }, [chainId, account]);

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Link className={styles.logo} to="/">
          <Image
            className={styles.pic}
            src="/images/logo-dark.png"
            srcDark="/images/logo-light.png"
            alt="Fitness Pro"
          />
        </Link>
        <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>
          <nav className={styles.nav}>
            {nav.map((x, index) => (
              <Link
                className={styles.link}
                // activeClassName={styles.active}
                to={x.url}
                key={index}
              >
                {x.title}
              </Link>
            ))}
          </nav>
          <form
            className={styles.search}
            action=""
            onSubmit={() => handleSubmit()}
          >
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              id="search"
              name="search"
              list="topbar-search"
              placeholder="Search"
              required
            />
            {
              searchedNfts.length > 0 && (
                <datalist id="topbar-search">
                  {
                    searchedNfts.map(nftItem => (
                      <option key={nftItem.objectId} value={nftItem.name} />
                    ))
                  }
                </datalist>
              )
            }

            <button className={styles.result}>
              <Icon name="search" size="20" />
            </button>
          </form>
          {
            user && (
              <Link
                className={cn("button-small", styles.button)}
                to="/upload-variants"
              >
                Upload
              </Link>
            )
          }
        </div>
        <Notification className={styles.notification} />
        {
          user && (
            <>
              <Link
                className={cn("button-small", styles.button)}
                to="/upload-variants"
              >
                Upload
              </Link>
              <Link
                className={cn("button-small", styles.button)}
                to={`/user/${user?.address}`}
              >
                My Profile
              </Link>
            </>
          )
        }
        {!user && (
          <button
            className={cn("button-stroke button-small", styles.button)}
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}

        {user && <User className={styles.user} deactivate={deactivate} />}
        <button
          className={cn(styles.burger, { [styles.active]: visibleNav })}
          onClick={() => setVisibleNav(!visibleNav)}
        ></button>
      </div>
      <LoaderModal visible={loading} />
    </header>
  );
};

export default Headers;
