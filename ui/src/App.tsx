import TopBar from "./components/top-bar/top-bar";
import BrowseView from "./components/browse-view/browse-view";
import SignUp from "./components/sign-up/sign-up";
import LogIn from "./components/log-in/log-in";
import React from "react";
import './colors.scss'
import Watchlist from "./components/watchlist/watchlist";
import UserContext, { User } from "./context";

interface Title {
    id: string,
    title: string,
    type: string,
    description: string,
    releaseYear: number,
    ageGuidance: string,
    runtime: number,
    rating: number,
    genres: string[],
    watched?: Watched,
}

interface Watched {
    rating: number,
    status: string,
    title?: Title,
}

interface Review {
    username: string,
    review: string,
    titleId: string,
    userId: number,
}

enum Views {
    Home,
    SignUp,
    LogIn,
    Watchlist
}

type AppProps = {};

type AppState = {
    view: Views;
    loggedIn: boolean;
    user?: User;
};

class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        view: Views.Home,
        loggedIn: false
    };

    signup = (): void => {
        this.setState({ view: Views.SignUp });
    }

    login = (): void => {
        this.setState({ view: Views.LogIn });
    }

    back = (user?: User): void => {
        this.setState({ view: Views.Home});
        if (user?.id && user?.username) {
            this.setState({ user, loggedIn: true });
        }
    }

    watchlist = (): void => {
        this.setState({ view: Views.Watchlist });
    }

    render() {
        return (
            <UserContext.Provider value={this.state.user}>
                <div>
                    {(this.state.view === Views.Home) && <div>
                        <TopBar home={true} loggedIn={this.state.loggedIn} signup={this.signup} login={this.login} watchlist={this.watchlist} />
                        <BrowseView loggedIn={this.state.loggedIn} />
                    </div>}
                    {(this.state.view !== Views.Home) && <div>
                        <TopBar home={false} back={this.back} />
                    </div>}
                    {(this.state.view === Views.SignUp) && <SignUp login={this.login} />}
                    {(this.state.view === Views.LogIn) && <LogIn home={this.back} />}
                    {(this.state.view === Views.Watchlist) && <Watchlist />}
                </div>
            </UserContext.Provider>
        );
    }
}

export { App };
export type { Title, Watched, Review };
