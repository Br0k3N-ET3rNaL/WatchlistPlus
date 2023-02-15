import TopBar from "./components/top-bar/top-bar";
import BrowseView from "./components/browse-view/browse-view";
import SignUp from "./components/sign-up/sign-up";
import LogIn from "./components/log-in/log-in";
import React from "react";

enum Views {
    Home,
    SignUp,
    LogIn
}

type AppProps = {};

type AppState = {
    view: Views;
    loggedIn: boolean;
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

    back = (loggedIn: boolean): void => {
        this.setState({ view: Views.Home, loggedIn });
    }

    render() {
        return (
            <div>
                {(this.state.view === Views.Home) && <div>
                    <TopBar home={true} loggedIn={this.state.loggedIn} signup={this.signup} login={this.login} />
                    <BrowseView />
                </div>}
                {(this.state.view !== Views.Home) && <div>
                    <TopBar home={false} back={this.back}/>
                </div>}
                {(this.state.view === Views.SignUp) && <SignUp login={this.login} />}
                {(this.state.view === Views.LogIn) && <LogIn home={this.back} />}
            </div>


        );
    }
}

export default App;
