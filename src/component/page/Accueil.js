import React, { Component } from 'react';
import UserContext from '../../context/UserContext';
import { Alert } from 'react-bootstrap';
import Utils from '../../Utils';
import { CardVideo } from './component';
import Rest from '../../Rest';

class Accueil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            items: [],
            error: null
        }
    }

    static contextType = UserContext;

    componentDidMount() {
        let arr = window.location.search.split('search=');
        const search = arr.length === 2 ? arr[1] : null;

        if (search === null) {
            Rest.apiRequest({ table: 'video', url: 'accueil', action: 'recent' }).then(resp => resp.text())
                .then(
                    (resp) => {
                        try {
                            resp = JSON.parse(resp);
                            if (resp) {
                                this.setState({
                                    isLoaded: true,
                                    items: resp
                                });
                            }
                            else {
                                this.setState({
                                    isLoaded: true,
                                    error: 'Erreur survenue'
                                });
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        }
        else {
            Rest.apiRequest({ table: 'video', url: 'accueil', action: 'search', search }).then(resp => resp.text())
                .then(
                    (resp) => {
                        try {
                            resp = JSON.parse(resp);
                            if (resp) {
                                this.setState({
                                    isLoaded: true,
                                    items: resp
                                });
                            }
                            else {
                                this.setState({
                                    isLoaded: true,
                                    error: 'Erreur survenue'
                                });
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        }
    }

    render() {
        const { user } = this.context;
        const { isLoaded, error, items } = this.state;

        if (error) {
            return (
                <div className="vh-100 d-flex align-items-center" style={{ marginTop: -80 }}>
                    <Alert variant='danger' className='text-center w-100'>
                        {error}
                    </Alert>
                </div>
            );
        }
        else if (!isLoaded) {
            return (
                <div className="vh-100 d-flex align-items-center" style={{ marginTop: -80 }}>
                    <Alert variant='success' className='text-center w-100'>
                        Chargement...
                    </Alert>
                </div>
            );
        }
        else {
            return (
                <div style={{ marginTop: 120 }}>
                    {user !== null ?
                        user.id_Role === 2 ?
                            <h1 className="text-center color-green">Bonjour Admin {user.prenom_User}</h1> :
                            <h1 className="text-center color-green">Bonjour {user.prenom_User}</h1> :
                        <h1 className="text-center color-green">Accueil</h1>
                    }
                    <div className="row">
                        {items.map(item => {
                            if (item.active_Video === 1) {
                                let date = new Date(item.date_Video);
                                date = Utils.writeDateSimple(date);
                                let vues = Utils.writeNumber(item.nb_vue);
                                return (
                                    <div key={item.id_Video} className="col-xl-2 col-lg-3 col-sm-6 d-flex justify-content-center mt-5">
                                        <CardVideo item={item} vues={vues} date={date} desc={true} />
                                    </div>
                                );
                            }
                            else {
                                return false;
                            }
                        })}
                    </div>
                </div>
            );
        }
    }
}

export { Accueil };