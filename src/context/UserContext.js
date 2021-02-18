import React, { Component } from 'react';
import Rest from '../Rest';

const UserContext = React.createContext();

class UserProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    setUser = (user) => {
        this.setState({ user });
    }

    componentDidMount() {
        if (localStorage.getItem('user') != null && localStorage.getItem('token') != null) {
            Rest.apiRequest({}, 'POST', true).then(resp => resp.text())
                .then(resp => {
                    try {
                        resp = JSON.parse(resp)[0];
                        if (resp) {
                            this.setUser(resp);
                        }
                        else {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            console.log(resp);
                        }
                    }
                    catch (e) {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        console.error('Erreur:' + e);
                    }
                });
        }
        else if (localStorage.getItem('user') == null && localStorage.getItem('token') != null) {
            localStorage.removeItem('token');
        }
    }

    render() {
        const { children } = this.props;
        const { user } = this.state;
        const { setUser } = this;

        return (
            <UserContext.Provider
                value={{
                    user,
                    setUser
                }}
            >
                {children}
            </UserContext.Provider>
        );
    }
}

export { UserProvider };

export default UserContext;