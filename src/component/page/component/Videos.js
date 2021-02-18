import React, { Component } from 'react';
import UserContext from "../../../context/UserContext";
import Rest from "../../../Rest";
import { Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Utils from '../../../Utils';
import { CardVideo } from './CardVideo';

class Videos extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nbVideos: 0,
            videos: [],
            isLoaded: false,
            error: null
        }
    }

    static contextType = UserContext;

    componentDidMount() {

        const { user } = this.context

        Rest.apiRequest({ table: "chaine", videos: user.id_Chaine, action: "videos", }).then(resp => resp.text())
            .then((resp) => {
                try {
                    resp = JSON.parse(resp)
                    this.setState({
                        isLoaded: true,
                        nbVideos: resp.length,
                        videos: resp
                    })
                }
                catch {
                    this.setState({
                        isLoaded: true,
                        error: "Erreur survenue"
                    })
                }
            })
    }

    render() {

        const { error, isLoaded, videos } = this.state;

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
        else if (videos.length > 0) {
            return (
                <>
                    <h1>Vos vidéos publiées</h1>
                    <div className="row">
                        {videos.map(item => {
                            let date = new Date(item.date_Video);
                            date = Utils.writeDateSimple(date);
                            let vues = Utils.writeNumber(item.nb_vue);
                            return (
                                <div key={item.id_Video} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center mt-5">
                                    <CardVideo item={item} vues={vues} date={date} desc={true} showInactive={true} />
                                </div>
                            );
                        })}
                    </div>
                </>
            );
        }
        else {
            return (
                <div className="vh-100 d-flex align-items-center" style={{ marginTop: -80 }}>
                    <Alert variant='success' className='text-center w-100'>
                        Vous retrouverez vos vidéos ici.
                    </Alert>
                </div>
            );
        }
    }
}


export { Videos };