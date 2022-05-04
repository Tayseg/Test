import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMoralis, useNativeBalance } from "react-moralis";
import "./styles/app.sass";
import Page from "./components/Page";
import { routes, userAuthRoutes } from "./routes";
import { useEffect, useState } from "react";
import { updateUser } from "./redux/features/user";
import { CHAIN, LOCALSTORAGE_USER } from './utils/constants';
import UserAuthGuard from "./guards/UserAuthGuard";
import LoaderModal from "./components/LoaderModal";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, authenticate } = useMoralis();
  const { getBalances } = useNativeBalance({ chain: CHAIN });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (localStorage.getItem(LOCALSTORAGE_USER)) {
        console.log('# isAuthenticated: ', isAuthenticated);
        if (!isAuthenticated) {
          await authenticate();
          const balanceData = await getBalances();
          const balance = Number(balanceData.balance) * Math.pow(10, -18);
          const userData = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER));

          userData.balance = balance;
          console.log('# userData: ', userData);
          localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));
          dispatch(updateUser(userData));
        } else {
          const balanceData = await getBalances();
          const balance = Number(balanceData.balance) * Math.pow(10, -18);
          const userData = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER));

          userData.balance = balance;
          console.log('# userData: ', userData);
          localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(userData));
          dispatch(updateUser(userData));
        }

      }
      setLoading(false);
    })();
  }, []);

  return (
    <Router>
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            exact
            path={route.path}
            render={() => (
              <Page>
                <route.component />
              </Page>
            )}
          />
        ))}
        {
          userAuthRoutes.map((route, index) => (
            <Route
              key={index}
              exact
              path={route.path}
              render={() => (
                <Page>
                  <UserAuthGuard>
                    <route.component />
                  </UserAuthGuard>
                </Page>
              )}
            />
          ))
        }
      </Switch>
      <LoaderModal visible={loading} />
    </Router>
  );
}

export default App;
