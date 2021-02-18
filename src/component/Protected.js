import React, { Component } from 'react';
import UserContext from '../context/UserContext';

class Protected extends Component {

    static contextType = UserContext;

    render() {
        const { user } = this.context;
        const { children, role, noauth } = this.props;
        
        return (
            ((noauth && !user) || (!noauth && user && (!role || user.role === role))) &&
            <>
                {children}
            </>
        );
    }
}

export { Protected };