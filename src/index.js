import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { MoralisProvider } from 'react-moralis';
import App from "./App";
import store from "./redux/store";
import { MORALIS_APP_ID, MORALIS_SERVER_URL, MORALIS_MASTER_KEY } from './utils/constants';

ReactDOM.render(
  <MoralisProvider appId={MORALIS_APP_ID} serverUrl={MORALIS_SERVER_URL} masterKey={MORALIS_MASTER_KEY}>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </MoralisProvider>,
  document.getElementById("root")
);
