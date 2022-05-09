import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMoralis, useMoralisFile, useNativeBalance } from "react-moralis";
import { useFileUpload } from "use-file-upload";
import cn from "classnames";
import { useHistory } from "react-router-dom";
import styles from "./UploadDetails.module.sass";
import Dropdown from "../../components/Dropdown";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Modal from "../../components/Modal";
import Preview from "./Preview";
import FolowSteps from "./FolowSteps";
import {
  CHAIN_ID,
  CHAIN_NAME,
  RPC_URLS,
  BLOCK_EXPLORER_URLS,
  NATIVE_CURRENCY_NAME,
  NATIVE_CURRENCY_SYMBOL,
  DECIMALS,
  SWITCH_ERROR_CODE,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  MORALIS_SERVER_URL,
  MORALIS_APP_ID,
  LOCALSTORAGE_USER,
} from "../../utils/constants";
import LoaderModal from "../../components/LoaderModal";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/features/user";

const Upload = () => {
  const { Moralis, authenticate, isAuthenticated, user } = useMoralis();
  const { getBalances } = useNativeBalance();
  const dispatch = useDispatch();
  const history = useHistory();
  const { register, handleSubmit, getValues, control, setValue } = useForm();
  const [file, selectFile] = useFileUpload();
  const [imageFile, setImageFile] = useState(null);
  const { moralisFile, saveFile } = useMoralisFile();
  const [moralisFileValue, setMoralisFileValue] = useState(null);
  // const [royalties, setRoyalties] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [royaltiesOptions, setRoyaltiesOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  //  Get the options of royalties from the server
  // useEffect(() => {
  //   (async () => {
  //     setLoading(true);
  //     await Moralis.start({ serverUrl: MORALIS_SERVER_URL, appId: MORALIS_APP_ID });
  //     const Royalty = Moralis.Object.extend('Royalty');
  //     const query = new Moralis.Query(Royalty);
  //     const { attributes: { minRoyalty, maxRoyalty, interval } } = (await query.find())[0];

  //     const getRoyalties = (royalties, currentRoyalty, _interval) => {
  //       if (maxRoyalty <= currentRoyalty + _interval) {
  //         royalties.push(`${maxRoyalty}%`);
  //         setRoyalties(royalties[0]);
  //         setRoyaltiesOptions(royalties);
  //       } else {
  //         currentRoyalty += _interval;
  //         royalties.push(`${currentRoyalty}%`);
  //         getRoyalties(royalties, currentRoyalty, _interval);
  //       }
  //     };

  //     if (minRoyalty === maxRoyalty) {
  //       setRoyaltiesOptions([`${minRoyalty}%`]);
  //     } else {
  //       getRoyalties([`${minRoyalty}%`], minRoyalty, interval);
  //     }
  //     setLoading(false);
  //   })();
  // }, []);

  //  Upload the image on IPFS when it is selected.
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Moralis.start({ serverUrl: MORALIS_SERVER_URL, appId: MORALIS_APP_ID });
      if (file) {
        await saveFile(file.name, file.file, { saveIPFS: true });  //  Upload an image file on IPFS
      }
      setImageFile(file);
      setLoading(false);
    })();
  }, [file?.source]);

  useEffect(() => {
    setMoralisFileValue(moralisFile);
  }, [moralisFile?._name]);

  //  Open confirm modal
  const openVisibleModal = async () => {
    setLoading(true);
    const { item_name, description, royalties, size, property } = getValues();

    if (item_name && description && file) {
      if (!isAuthenticated) {
        await authenticate();
      }
      if (moralisFileValue) {
        const imageCid = await moralisFileValue.ipfs(); //  Get the URI of the uploaded image
        setMoralisFileValue(null);

        //  Prepare the metadata of NFT
        const metadata = {
          name: item_name,
          description: description,
          image: imageCid,
        };

        if (size) {
          metadata.size = size;
        }

        if (property) {
          metadata.property = property;
        }

        if (royalties) {
          metadata.royaltiesAmount = Number(royalties.split('%')[0]);
        }

        const jsonFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) }); //  Make a file with that metadata
        await saveFile("metadata.json", jsonFile._source, { saveIPFS: true });   // Upload the file

        setVisibleModal(true);  // Open Modal
      }
    } else {
      alert('Name, Description and Image are required.');
    }
    setLoading(false);
  };

  //  Mint a single item
  const handleCreateSingleItem = async () => {
    setVisibleModal(false);
    setLoading(true);
    const { item_name, description, size, property } = getValues();
    // let royalty;

    // if (royalties) {
    //   royalty = Number(royalties.split('%')[0]) * 100; //  Calculate the correct royalities
    // } else {
    //   royalty = 0;
    // }

    let royalty = 0;

    try {
      await Moralis.enableWeb3();

      const transaction2 = await Moralis.executeFunction({
        contractAddress: CONTRACT_ADDRESS,
        functionName: 'totalSupply',
        abi: CONTRACT_ABI
      });

      console.log('# transaction2: ', transaction2);

      const tokenId = Number(transaction2._hex);

      const tokenUri = await moralisFileValue.ipfs();  //  Get the URI of the uploaded file. This is the tokenURI of NFT

      const userAddress = user.get('ethAddress');

      //  Mint the NFT that has that metadata
      const transaction = await Moralis.executeFunction({
        contractAddress: CONTRACT_ADDRESS,
        functionName: 'createSingleItem',
        abi: CONTRACT_ABI,
        params: {
          _tokenUri: tokenUri,
          _royalty: royalty
        }
      });

      await transaction.wait();

      /* ------------ Save the data on the DB of Moralis ------------- */

      const Items = Moralis.Object.extend('Items');
      const item = new Items();

      item.set('tokenId', tokenId);
      item.set('tokenUri', tokenUri);
      item.set('ownerAccount', userAddress);
      item.set('name', item_name);
      item.set('description', description);
      item.set('royalty', royalty);
      item.set('size', size);
      item.set('property', property);
      item.set('price', 0);
      item.set('onSale', false);

      await item.save()
        .then(result => {
          console.log('# result: ', result);
          alert('Success.');
        })
        .catch(error => {
          console.log('# error: ', error);
          alert('Failed.');
        });

      /* -------------------------------------------------------------- */

      /* ---------  Update the current balance of wallet -------------- */
      const balanceData = await getBalances();
      const balance = Number(balanceData.balance) * Math.pow(10, -18);
      const userData = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER));

      userData.balance = balance;
      console.log('# userData: ', userData);
      localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));
      dispatch(updateUser(userData));
      /* -------------------------------------------------------------- */

      setLoading(false);
      clearData();
      history.push(`/user/${userData.address}`);
    } catch (error) {
      console.log(error);
    }
  };

  //  Clear all values
  const clearData = () => {
    setImageFile(null);
    // setRoyalties('');
    setMoralisFileValue(null);
    setValue('item_name', '');
    setValue('description', '');
    setValue('size', '');
    setValue('property', '');
  };

  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <div className={cn("h2", styles.title)}>
                Create single collectible
              </div>
            </div>
            <form className={styles.form} onSubmit={handleSubmit(data => handleCreateSingleItem(data))}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Upload file</div>
                  <div className={styles.file}>
                    <button
                      className={styles.load}
                      onClick={() => {
                        selectFile();
                      }}
                    >
                      Click to Upload
                    </button>
                    <div className={styles.icon}>
                      <Icon name="upload-file" size="24" />
                    </div>
                    <div className={styles.format}>
                      PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
                    </div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Item Details</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="Item name"
                      name="item_name"
                      type="text"
                      register={register}
                      placeholder='e. g. Redeemable Bitcoin Card with logo"'
                      required
                    />

                    <TextInput
                      className={styles.field}
                      label="Description"
                      type="text"
                      name="description"
                      register={register}
                      placeholder="e. g. “After purchasing you will able to recived the logo...”"
                      required
                    />
                    <div className={styles.row}>
                      {/* <div className={styles.col}>
                        <div className={styles.field}>
                          <div className={styles.label}>Royalties</div>
                          <Dropdown
                            className={styles.dropdown}
                            value={royalties}
                            setValue={setRoyalties}
                            register={register}
                            options={royaltiesOptions}
                          />
                        </div>
                      </div> */}
                      <div className={styles.col}>
                        <TextInput
                          className={styles.field}
                          label="Size"
                          name="size"
                          type="text"
                          placeholder="e. g. Size"
                          register={register}
                          required
                        />
                      </div>
                      <div className={styles.col}>
                        <TextInput
                          className={styles.field}
                          label="Propertie"
                          name="property"
                          type="text"
                          placeholder="e. g. Propertie"
                          register={register}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button>
                {
                  moralisFileValue ? (
                    <button
                      className={cn("button", styles.button)}
                      onClick={openVisibleModal}
                      type="button"
                    >
                      <span>Create item</span>
                      <Icon name="arrow-next" size="10" />
                    </button>
                  ) : (
                    <></>
                  )
                }
              </div>
            </form>
          </div>
          <Preview
            file={file}
            // royalties={royalties}
            control={control}
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)}
            clearData={clearData}
            imageFile={imageFile}
          />
        </div>
      </div>
      <Modal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <FolowSteps
          className={styles.steps}
          handleCreateSingleItem={handleCreateSingleItem}
        />
      </Modal>
      <LoaderModal visible={loading} />
    </>
  );
};

export default Upload;
