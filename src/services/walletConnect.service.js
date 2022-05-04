import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

export class WalletConnectService {
  connector;
  events = {
    CONNECT: "connect",
    SESSION_UPDATE: "session_update",
    DISCONNECT: "disconnect",
  };
  bridge = "https://bridge.walletconnect.org";

  initConnection() {
    // Create a connector
    this.connector = new WalletConnect({
      bridge: this.bridge, // Required
      qrcodeModal: QRCodeModal,
    });

    console.log("this.connector :", this.connector);
    // Check if connection is already established
    if (!this.connector.connected) {
      // create new session
      this.connector.createSession();
    }

    // Subscribe to connection events
    this.connector.on(this.events.CONNECT, (error, payload) => {
      if (error) {
        throw error;
      }

      console.log(this.events.CONNECT, payload);
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });

    this.connector.on(this.events.SESSION_UPDATE, (error, payload) => {
      if (error) {
        throw error;
      }

      console.log(this.events.SESSION_UPDATE, payload);

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });

    this.connector.on(this.events.DISCONNECT, (error, payload) => {
      if (error) {
        throw error;
      }

      console.log(this.events.DISCONNECT, payload);

      // Delete connector
    });
  }
}
