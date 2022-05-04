import { metamaskConnectService } from "./index";
import store from "../redux/store";
import { updateUser } from "../redux/features/user";

export class UserService {
  USER_LOCAL_KEY = "user";
  initUser() {
    const user = localStorage.getItem(this.USER_LOCAL_KEY);
    return JSON.parse(user);
  }

  onDisconnectWallet() {
    console.log("onDisconnectWallet");
    localStorage.removeItem(this.USER_LOCAL_KEY);
    store.dispatch(updateUser(null));
  }

  async fetchWallet() {
    const address = await metamaskConnectService.getAccounts();
    const balance = await metamaskConnectService.getBalance();

    localStorage.setItem(
      this.USER_LOCAL_KEY,
      JSON.stringify({ address: address[0], balance })
    );

    if (!address && !balance) return {};

    return {
      address: address[0],
      balance: balance,
    };
  }
}
