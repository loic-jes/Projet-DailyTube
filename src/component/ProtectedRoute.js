import React, { Component } from 'react';
import UserContext from '../context/UserContext';
import { Route, Redirect } from "react-router-dom";

class ProtectedRoute extends Component {

    static contextType = UserContext;

    render() {
        const { user } = this.context;
        const { component: Component, noauth, role, ...rest } = this.props;

        return (
            <Route 
                {...rest}
            >
                {routeProps => 
                    (noauth && !user) || 
                    (!noauth && user && (!role || user.id_role === role)) ? (
                        <Component {...routeProps} />
                    ) : (
                        <Redirect to="/" />
                    )
                }
            </Route>
        );
    }
}

export default ProtectedRoute;
