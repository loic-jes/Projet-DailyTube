import React, { Component } from 'react';
import Rest from '../../Rest';
import { Alert } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import Utils from '../../Utils';
import { CardVideo } from './component';

class Abonnement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            items: [],
            error: null
        };
    }

    static contextType = UserContext;

    componentDidMount() {
        const { user } = this.context;
        Rest.apiRequest({ table: 'video', id: user.id_User, url: 'abonnement' }).then(resp => resp.text())
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

    render() {
        const { error, isLoaded, items } = this.state;

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
        else if (items.length > 0) {
            return (
                <div className="row">
                    {items.map(item => {
                        let date = new Date(item.date_Video);
                        date = Utils.writeDateSimple(date);
                        let vues = Utils.writeNumber(item.nb_vue);
                        if (item.active_Video > 0) {
                            return (
                                <div key={item.id_Video} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center mt-5">
                                    <CardVideo item={item} vues={vues} date={date} desc={true} />
                                </div>
                            );
                        }
                        else {
                            return false;
                        }
                    })}
                </div>
            );
        }
        else {
            return (
                <div className="vh-100 d-flex align-items-center" style={{ marginTop: -80 }}>
                    <Alert variant='success' className='text-center w-100'>
                        Vous retrouverez les vidéos de vos abonnements ici.
                    </Alert>
                </div>
            );
        }
    }
}

export { Abonnement };