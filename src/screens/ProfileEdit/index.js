import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useMoralis, useMoralisFile } from "react-moralis";
import { useFileUpload } from "use-file-upload";
import styles from "./ProfileEdit.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import Icon from "../../components/Icon";
import LoaderModal from "../../components/LoaderModal";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Edit Profile",
  },
];

const ProfileEdit = () => {
  const { Moralis, isAuthenticated, authenticate } = useMoralis();
  const { moralisFile, saveFile } = useMoralisFile();
  const [file, selectFile] = useFileUpload();
  const history = useHistory();
  const { address } = useParams();
  const [userData, setUserData] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClearAll = () => {
    setDisplayName('');
    setAvatar('');
    setBio('');
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    if (avatar && displayName && bio) {
      const User = Moralis.Object.extend('_User');
      const query = new Moralis.Query(User);

      query.equalTo('objectId', userData.objectId);
      const _user = await query.first();
      _user.set('displayName', displayName);
      _user.set('avatar', avatar);
      _user.set('bio', bio);
      await _user.save();
      setLoading(false);
      history.push(`/user/${address}`);
    } else {
      alert('You should fill all fields including avatar.');
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      // if (!isAuthenticated) {
      //   await authenticate();
      // }
      const User = Moralis.Object.extend('_User');
      const query = new Moralis.Query(User);

      query.equalTo('accounts', address);
      const { id, attributes } = await query.first();

      setUserData({
        objectId: id,
        ...attributes
      });
      setDisplayName(attributes.displayName || '');
      setAvatar(attributes.avatar || '');
      setBio(attributes.bio || '');
      setLoading(false);
    })();
  }, []);

  //  Avatar upload
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (file) {
        await saveFile(file.name, file.file, { saveIPFS: true });  //  Upload an image file on IPFS
      }
    })();
  }, [file?.source]);

  useEffect(() => {
    (async () => {
      if (moralisFile) {
        const avatarCid = await moralisFile.ipfs();
        setAvatar(avatarCid);
      }
      setLoading(false);
    })();
  }, [moralisFile?._name]);

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Edit profile</h1>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  <img src={avatar || file?.source} alt="Avatar" />
                </div>
                <div className={styles.details}>
                  <div className={styles.stage}>Profile photo</div>
                  <div className={styles.text}>
                    We recommend an image of at least 400x400. Gifs work too.
                  </div>
                  <div className={styles.file}>
                    <button
                      className={cn(
                        "button-stroke button-small",
                        styles.button
                      )}
                      onClick={selectFile}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="display name"
                      name="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      type="text"
                      placeholder="Enter your display name"
                      required
                    />
                    <TextArea
                      className={styles.field}
                      label="Bio"
                      name="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="About yourself in a few words"
                      required="required"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.note}>
                To update your settings you should sign message through your
                wallet. Click 'Update profile' then sign the message
              </div>
              <div className={styles.btns}>
                <button className={cn("button", styles.button)} onClick={handleUpdateProfile}>
                  Update Profile
                </button>
                <button className={styles.clear} onClick={handleClearAll}>
                  <Icon name="circle-close" size="24" />
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoaderModal visible={loading} />
    </div>
  );
};

export default ProfileEdit;
