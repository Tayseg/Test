import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { userService } from "./index";

export class MetamaskConnectService {
  provider;
  web3;
  constructor() {
    this.init();
  }

  async init() {
    const provider = await detectEthereumProvider();

    if (!provider) {
      window.alert("Please install MetaMask first.");
      return;
    }

    this.provider = provider;
    this.web3 = new Web3(this.provider);

    window.ethereum.on("disconnect", () => {
      console.log("on disconnect called");
      userService.onDisconnectWallet();
    });
  }

  async initConnection() {
    await window.ethereum.enable();
  }

  async getAccounts() {
    try {
      if (!this.provider) {
        window.alert("Please install MetaMask first.");
        return;
      }

      console.log('# window.ethereum: ', window.ethereum);
      await window.ethereum.enable();
      const web3 = new Web3(this.provider);

      const addresses = await web3.eth.getAccounts();
      return addresses;
    } catch (error) {
      console.log('# error: ', error);
    }

  }

  async getBalance() {
    if (!this.provider) {
      window.alert("Please install MetaMask first.");
      return;
    }

    await window.ethereum.enable();

    const addresses = await this.web3.eth.getAccounts();
    const balance = await this.web3.eth.getBalance(addresses[0]);

    return balance;
  }
}
