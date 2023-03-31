/* eslint-disable @typescript-eslint/no-shadow */
import React from "react";
import TopBar from "./components/top-bar/top-bar";
import BrowseView from "./components/browse-view/browse-view";
import SignUp from "./components/sign-up/sign-up";
import LogIn from "./components/log-in/log-in";
import './colors.scss'
import Watchlist from "./components/watchlist/watchlist";
import UserContext, { User } from "./context";

enum Views {
    Home,
    SignUp,
    LogIn,
    Watchlist
}

type AppProps = Record<string, never>;

type AppState = {
    view: Views;
    loggedIn: boolean;
    user?: User;
};

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps | Readonly<AppProps>) {
        super(props);

        this.state = {
            view: Views.Home,
            loggedIn: false
        };
    }

    signup = (): void => {
        this.setState({ view: Views.SignUp });
    }

    login = (): void => {
        this.setState({ view: Views.LogIn });
    }

    back = (user?: User): void => {
        if (user?.id && user?.username) {
            this.setState({ user, loggedIn: true });
        }
        this.setState({ view: Views.Home });
    }

    watchlist = (): void => {
        this.setState({ view: Views.Watchlist });
    }

    render() {
        const { user } = this.state;
        const { view } = this.state;
        const { loggedIn } = this.state;
        return (
            <UserContext.Provider value={user}>
                <div>
                    {(view === Views.Home) && <div>
                        <TopBar home loggedIn={loggedIn} signup={this.signup} login={this.login} watchlist={this.watchlist} />
                        <BrowseView loggedIn={loggedIn} />
                    </div>}
                    {(view !== Views.Home) && <div>
                        <TopBar home={false} back={this.back} />
                    </div>}
                    {(view === Views.SignUp) && <SignUp login={this.login} />}
                    {(view === Views.LogIn) && <LogIn home={this.back} />}
                    {(view === Views.Watchlist) && <Watchlist />}
                </div>
            </UserContext.Provider>
        );
    }
}

export default App;
