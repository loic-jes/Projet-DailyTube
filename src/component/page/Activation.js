import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Rest from '../../Rest';

class Activation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: false,
            msg: ''
        }
    }

    componentDidMount() {
        const token = this.props.match.params.token;

        Rest.apiRequest({
            table: 'user',
            url: 'activation',
            token
        }, 'POST').then(resp => resp.text())
        .then(
            resp => {
                try {
                    resp = JSON.parse(resp);
                    if (resp) {
                        this.setState({
                            isLoaded: true,
                            msg: 'Votre compte a bien été activer.'
                        });
                    }
                    else {
                        this.setState({
                            isLoaded: true,
                            error: true,
                            msg: 'Erreur survenue.'
                        });
                    }
                }
                catch(e){
                    console.log(e);
                }
            }
        )
    }

    render() {
        const { isLoaded, error, msg } = this.state;
        if (!isLoaded) {
            return (
                <div className="vh-100 d-flex align-items-center" style={{ marginTop: -80 }}>
                    <Alert variant='success' className='text-center w-100'>
                        Chargement...
                    </Alert>
                </div>
            );
        }
        else if (!error) {
            return (
                <div className="vh-100 d-flex align-items-center" style={{ marginTop: -80 }}>
                    <Alert variant='success' className='text-center w-100'>
                        {msg}
                    </Alert>
                </div>
            );
        }
        else {
            return (
                <div className="vh-100 d-flex align-items-center" style={{ marginTop: -80 }}>
                    <Alert variant='warning' className='text-center w-100'>
                        {msg}
                    </Alert>
                </div>
            );
        }
    }
}

export default withRouter(Activation);