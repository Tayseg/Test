//	Get all NFTs
Moralis.Cloud.define("getAllNfts", async (request) => {
  const Items = Moralis.Object.extend('Items');
  const query = new Moralis.Query(Items);
  query.descending('createdAt');

  const response = await query.find();

  const results = response.map(resItem => {
    const nftItem = { objectId: resItem.id, ...resItem.attributes };
    return nftItem;
  });
  
  return results;
});

//	Search NFTs
Moralis.Cloud.define('searchNfts', async (request) => {
  const { params: { searchKeyName, searchKeyDescription, values, sortMethod } } = request;
  const Items = Moralis.Object.extend('Items');
  const query = new Moralis.Query(Items);

  query.equalTo('name', { $regex: searchKeyName, $options: 'i' });  // Search by name
  query.equalTo('description', { $regex: searchKeyDescription, $options: 'i' });  //  Search by description

  //  Search by price range
  if (values.length > 0) {
    if (values.length === 1) {
      query.equalTo('price', { $lt: values[0] });
    } else {
      query.equalTo('price', { $and: { $gt: values[0], $lt: values[1] } });
    }
  }

  //  Sort the results
  if (sortMethod === 'Newest') {
    query.descending('createdAt');
  } else {
    query.ascending('createdAt');
  }
  const response = await query.find();
  const results = response.map(resItem => {
    const nftItem = { objectId: resItem.id, ...resItem.attributes };
    return nftItem;
  });
  
  return results;
});

//	Get the NFTs of a user
Moralis.Cloud.define('getNftsByOwner', async (request) => {
  const { params: { ownerAccount } } = request;
  const Items = Moralis.Object.extend('Items');
  const query = new Moralis.Query(Items);

  query.equalTo('ownerAccount', ownerAccount);
  query.descending('createdAt');
  const response = await query.find();
  const results = response.map(resItem => {
    const nftItem = { objectId: resItem.id, ...resItem.attributes };
    return nftItem;
  });
  
  return results;
});