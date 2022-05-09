import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { MoralisProvider } from 'react-moralis';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import App from "./App";
import store from "./redux/store";
import { MORALIS_APP_ID, MORALIS_SERVER_URL, MORALIS_MASTER_KEY } from './utils/constants';

const getLibrary = (provider) => {
  const library = new Web3Provider(provider, "any");
  return library;
};

ReactDOM.render(
  <MoralisProvider appId={MORALIS_APP_ID} serverUrl={MORALIS_SERVER_URL} masterKey={MORALIS_MASTER_KEY}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Provider>
    </Web3ReactProvider>
  </MoralisProvider>,
  document.getElementById("root")
);
