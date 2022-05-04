import Home from "./screens/Home";
import UploadVariants from "./screens/UploadVariants";
import UploadDetails from "./screens/UploadDetails";
import ConnectWallet from "./screens/ConnectWallet";
import Faq from "./screens/Faq";
import Activity from "./screens/Activity";
import Search01 from "./screens/Search01";
import Search02 from "./screens/Search02";
import Profile from "./screens/Profile";
import ProfileEdit from "./screens/ProfileEdit";
import Item from "./screens/Item";
import PageList from "./screens/PageList";

export const routes = [
    {
        path: '/',
        component: Home,
    },

    {
        path: '/connect-wallet',
        component: ConnectWallet,
    },
    {
        path: '/faq',
        component: Faq,
    },
    {
        path: '/activity',
        component: Activity,
    },

    {
        path: '/search01',
        component: Search01,
    },

    {
        path: '/search02',
        component: Search02,
    },

    {
        path: '/nft/:address/:tokenId',
        component: Item,
    },

    {
        path: '/pagelist',
        component: PageList,
    }
];

export const userAuthRoutes = [
    {
        path: '/user/:address',
        component: Profile
    },
    {
        path: '/user/:address/edit',
        component: ProfileEdit,
    },
    {
        path: '/upload-variants',
        component: UploadVariants,
    },
    {
        path: '/upload-details',
        component: UploadDetails,
    },
];
