import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Range, getTrackBackground } from "react-range";
import { useMoralis } from "react-moralis";
// import Arweave from 'arweave';
import styles from "./Search01.module.sass";
import Icon from "../../components/Icon";
import Card from "../../components/Card";
import Dropdown from "../../components/Dropdown";
import { MORALIS_APP_ID, MORALIS_SERVER_URL } from "../../utils/constants";
import Loader from '../../components/Loader';
import LoaderModal from "../../components/LoaderModal";

const dateOptions = ["Newest", "Oldest"];
const STEP = 0.1;
const MIN = 0.01;
const MAX = 10;

const Search = () => {
  const { Moralis } = useMoralis();
  const [values, setValues] = useState([10]);
  const [nfts, setNfts] = useState([]);
  const [searchKeyName, setSearchKeyName] = useState('');
  const [searchKeyDescription, setSearchKeyDescription] = useState('');
  const [sortMethod, setSortMethod] = useState(dateOptions[0]);
  const [loading, setLoading] = useState(true);

  //  Clear all search keys
  const clearSearchKeys = () => {
    setSearchKeyName('');
    setSearchKeyDescription('');
    setValues([10]);
  };

  //  Get all NFTs
  const getAllNfts = async () => {
    try {
      setLoading(true);
      await Moralis.start({ serverUrl: MORALIS_SERVER_URL, appId: MORALIS_APP_ID });
      const results = await Moralis.Cloud.run('getAllNfts');

      console.log('# results: ', results);

      setNfts(results);
      setLoading(false);
    } catch (error) {
      console.log('# error: ', error);
      setLoading(false);
    }
  };

  //  Search by name
  const handleSearch = async () => {
    setLoading(true);
    const results = await Moralis.Cloud.run('searchNfts', { searchKeyName, searchKeyDescription, values, sortMethod });

    console.log('# results: ', results);

    setNfts(results);
    setLoading(false);
  };

  //  Handle the sort method
  const handleSort = (_sortMethod) => {
    setLoading(true);
    setSortMethod(_sortMethod);
    if (_sortMethod === 'Newest') {
      nfts.sort((prevItem, nextItem) => (Number(nextItem.createdAt) - Number(prevItem.createdAt)));
    } else {
      nfts.sort((prevItem, nextItem) => (Number(prevItem.createdAt) - Number(nextItem.createdAt)));
    }
    setLoading(false);
  };

  //  Handle reset filters
  const handleReset = () => {
    clearSearchKeys();
    getAllNfts();
  };

  useEffect(() => {
    clearSearchKeys();
    getAllNfts();
  }, []);

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.top}>
          <div className={styles.title}>Type your keywords</div>
          <div className={styles.search}>
            <Dropdown
              className={styles.dropdown}
              value={sortMethod}
              setValue={handleSort}
              options={dateOptions}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.filters}>
            <div className={styles.dropdown}>
              <div className={styles.label}>Name</div>
              <input
                className={styles.input}
                type="text"
                value={searchKeyName}
                onChange={(e) => setSearchKeyName(e.target.value)}
                name="name"
                placeholder="Type here..."
                required
              />
            </div>

            <div className={styles.range}>
              <div className={styles.label}>Description</div>
              <input
                className={styles.input}
                type="text"
                value={searchKeyDescription}
                onChange={(e) => setSearchKeyDescription(e.target.value)}
                name="description"
                placeholder="Type here..."
                required
              />
            </div>

            <div className={styles.range}>
              <div className={styles.label}>Price range</div>
              <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={(values) => setValues(values)}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: "36px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: "8px",
                        width: "100%",
                        borderRadius: "4px",
                        background: getTrackBackground({
                          values,
                          colors: ["#3772FF", "#E6E8EC"],
                          min: MIN,
                          max: MAX,
                        }),
                        alignSelf: "center",
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "24px",
                      width: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#3772FF",
                      border: "4px solid #FCFCFD",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-33px",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontFamily: "Poppins",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        backgroundColor: "#141416",
                      }}
                    >
                      {values[0].toFixed(1)}
                    </div>
                  </div>
                )}
              />
              <div className={styles.scale}>
                <div className={styles.number}>0.01 TFUEL</div>
                <div className={styles.number}>10 TFUEL</div>
              </div>
            </div>

            <div className={styles.reset} onClick={handleReset}>
              <Icon name="close-circle-fill" size="24" />
              <span>Reset filter</span>
            </div>

            <div className={styles.btns}>
              <button className={cn("button", styles.button)} onClick={handleSearch}>
                <span>Search</span>
              </button>
            </div>
          </div>

          <div className={styles.wrapper}>
            {
              loading ? (
                <div className={styles.loading}>
                  
                </div>
              ) : (
                <div className={styles.list}>
                  {nfts.map((x, index) => x.onSale && <Card className={styles.card} item={x} key={index} />)}
                </div>
              )
            }
          </div>
        </div>
      </div>
      <LoaderModal visible={loading} />
    </div>
  );
};

export default Search;
