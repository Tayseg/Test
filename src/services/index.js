import { WalletConnectService } from "./walletConnect.service";
import { MetamaskConnectService } from "./metamaskConnect.service";
import { UserService } from "./user.service";

const walletConnectService = new WalletConnectService();
const metamaskConnectService = new MetamaskConnectService();
const userService = new UserService();

export { walletConnectService, metamaskConnectService, userService };
