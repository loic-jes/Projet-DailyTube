import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Rest from '../../Rest';
import Utils from '../../Utils';
import { Alert, Button, Form } from 'react-bootstrap';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import UserContext from '../../context/UserContext';
import { CardVideo } from './component';
import { Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

class Video extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            video: [],
            all: [],
            commentaire: [],
            reponse: [],
            error: null,
            showAll: [],
            showCommentaire: [],
            abonner: false,
            checkAbonner: false
        };
        this.handleJaimeVideo = this.handleJaimeVideo.bind(this);
        this.handleJaimePasVideo = this.handleJaimePasVideo.bind(this);
        this.handleJaimeCommentaire = this.handleJaimeCommentaire.bind(this);
        this.handleJaimePasCommentaire = this.handleJaimePasCommentaire.bind(this);
        this.fetchMoreDataAll = this.fetchMoreDataAll.bind(this);
        this.fetchMoreDataCommentaire = this.fetchMoreDataCommentaire.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.handleClickAbonner = this.handleClickAbonner.bind(this);
        this.commentaireRef = React.createRef();
    }

    static contextType = UserContext;

    getData() {
        const id = this.props.match.params.id;

        Rest.apiRequest({ table: 'video', id: id }).then(resp => resp.text())
            .then(
                (resp) => {
                    try {
                        resp = JSON.parse(resp);
                        if (resp) {
                            this.setState({
                                video: [resp.video],
                                all: resp.all
                            });
                            this.setState({
                                showAll: this.state.all.slice(0, 20)
                            });
                        }
                        else {
                            this.setState({
                                isLoaded: true,
                                error: 'Erreur survenue'
                            });
                        }
                        const idVideo = this.state.video[0].id_Video;
                        Rest.apiRequest({ table: 'commentaire', url: 'video', id: idVideo }).then(resp => resp.text())
                            .then(
                                resp => {
                                    try {
                                        resp = JSON.parse(resp);
                                        if (resp) {
                                            this.setState({
                                                commentaire: resp
                                            });
                                            this.setState({
                                                showCommentaire: this.state.commentaire.slice(0, 20)
                                            });
                                        }
                                        else {
                                            this.setState({
                                                isLoaded: true,
                                                error: 'Erreur survenue'
                                            });
                                        }
                                        Rest.apiRequest({ table: 'reponse', url: 'video', id: idVideo }).then(resp => resp.text())
                                            .then(
                                                resp => {
                                                    try {
                                                        resp = JSON.parse(resp);
                                                        if (resp) {
                                                            this.setState({
                                                                reponse: resp,
                                                                isLoaded: true
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
                                                }
                                            )
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }
                            )
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

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        const { user } = this.context;
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getData();
        }
        if (user && !this.state.checkAbonner) {
            let idUser = user.id_User;
            let idChaine = this.state.video[0].id_Chaine;
            Rest.apiRequest({ table: 'user', url: 'abonner', idChaine, idUser }).then(resp => resp.text())
                .then(
                    resp => {
                        try {
                            if (resp) {
                                resp = JSON.parse(resp);
                                if (resp.length === 1) {
                                    this.setState({
                                        abonner: true,
                                    });
                                }
                                this.setState({
                                    checkAbonner: true
                                });
                            }
                            else {
                                console.log(resp);
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                )
        }
    }

    putJaimeVideo(obj) {
        const { user } = this.context;
        const idUser = user.id_User;
        const video = this.state.video[0];
        const idVideo = video.id_Video;

        Rest.apiRequest({
            table: 'video',
            url: 'voter',
            params: obj,
            idVideo,
            idUser
        }, 'PUT').then(resp => resp.text())
            .then(
                resp => {
                    try {
                        resp = JSON.parse(resp);
                        if (resp) {
                            console.log(resp);
                        }
                        else {
                            console.log(resp);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            )
    }

    handleJaimeVideo() {
        const video = this.state.video[0];
        const nbJaime = video.jaime_Video;
        this.putJaimeVideo({ jaime_Video: nbJaime + 1 });
    }

    handleJaimePasVideo() {
        const video = this.state.video[0];
        const nbJaimePas = video.jaime_pas_Video;
        this.putJaimeVideo({ jaime_pas_Video: nbJaimePas + 1 });
    }

    handleJaimeCommentaire() {
        console.log('jaime !');
    }

    handleJaimePasCommentaire() {
        console.log('jaime pas !');
    }

    handleKeypress(event) {
        if (event.key === 'Enter') {
            const idVideo = this.state.video[0].id_Video;
            const { user } = this.context;
            let date = new Date();
            let currentTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            let commentaire = {
                texte_Commentaire: this.commentaireRef.current.value,
                date_Commentaire: currentTime,
                jaime_Commentaire: 0,
                jaime_pas_Commentaire: 0,
                active_Commentaire: 1,
                id_User: user.id_User,
                id_Video: idVideo
            };

            Rest.apiRequest({
                table: 'commentaire',
                params: commentaire
            }, 'POST').then(resp => resp.text())
                .then(
                    resp => {
                        try {
                            resp = JSON.parse(resp);
                            if (resp) {
                                commentaire.id_Commentaire = resp;
                                commentaire.pseudo_User = user.pseudo_User;
                                commentaire.avatar = user.avatar;
                                let commentaireArr = this.state.commentaire;
                                let showCommentaireArr = this.state.showCommentaire;
                                commentaireArr.unshift(commentaire);
                                showCommentaireArr.unshift(commentaire);
                                this.setState({
                                    commentaire: commentaireArr,
                                    showCommentaire: showCommentaireArr
                                });
                                this.commentaireRef.current.blur();
                                this.commentaireRef.current.value = '';
                            }
                            else {
                                console.log(resp);
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                )
        }
    }

    handleClickAbonner(event) {
        const { user } = this.context;
        const idUser = user.id_User;
        const idChaine = this.state.video[0].id_Chaine;
        let value = event.target.textContent;

        if (value === "S'ABONNER") {
            Rest.apiRequest({
                table: 'abonner',
                params: {
                    id_User: idUser,
                    id_Chaine: idChaine
                }
            }, 'POST').then(resp => resp.text())
                .then(
                    resp => {
                        try {
                            resp = JSON.parse(resp);
                            if (resp === 0) {
                                this.setState({
                                    abonner: true
                                });
                            }
                            else {
                                console.log(resp);
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                )
        }
        else {
            Rest.apiRequest({
                table: 'abonner',
                id: idUser,
                tableId: 'user',
                joinId: idChaine,
                joinAs: 'chaine'
            }, 'DELETE').then(resp => resp.text())
                .then(
                    resp => {
                        try {
                            resp = JSON.parse(resp);
                            if (resp) {
                                this.setState({
                                    abonner: false
                                });
                            }
                            else {
                                console.log(resp);
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                )
        }
    }


    fetchMoreDataAll() {
        let len = this.state.showAll.length;
        this.setState({
            showAll: this.state.all.slice(0, len + 20)
        });
    }

    fetchMoreDataCommentaire() {
        let len = this.state.showCommentaire.length;
        this.setState({
            showCommentaire: this.state.commentaire.slice(0, len + 20)
        });
    }

    render() {
        const { error, isLoaded, video, showAll, showCommentaire, reponse } = this.state;
        const { user } = this.context;

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
        else if (video.length === 1) {
            if (video[0].active_Video === 1) {
                return (
                    <div className="row marginTop">
                        <div className="col-lg-9 col-md-12">
                            {
                                video.map(item => {
                                    // Traitement Date
                                    let date = new Date(item.date_Video);
                                    date = Utils.writeDateDev(date);

                                    // Traitement vues
                                    let vues = String(item.nb_vue);
                                    vues = vues.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

                                    // Traitement Jaime
                                    let jaime = Utils.writeNumber(item.jaime_Video);
                                    let jaimePas = Utils.writeNumber(item.jaime_pas_Video);

                                    // Traitement Abonnées
                                    let abonnes = Utils.writeNumber(item.nb_abonne);

                                    // Div Video (gauche)
                                    return (
                                        <div key={item.id_Video}>
                                            <div>
                                                <video className="w-100" controls>
                                                    <source src={Utils.prefixVideo + item.source} />
                                                    Votre navigateur ne supporte pas ce format de vidéo.
                                                </video>
                                            </div>
                                            <div>
                                                <h1 className="h3 text-white mt-3">{item.titre_Video}</h1>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-9 p-0">
                                                    <p className="text-white m-0">{vues} vues - {date}</p>
                                                </div>
                                                <div className="col-3 text-white d-flex">
                                                    <div className="d-flex align-items-center mr-3">
                                                        <div>{jaime}</div>
                                                        {user ?
                                                            <AiFillLike className="color-green fs-24 ml-1 cursor-pointer" onClick={this.handleJaimeVideo} title="J'aime ce contenu" /> :
                                                            <AiFillLike className="color-green fs-24 ml-1" />
                                                        }
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <div>{jaimePas}</div>
                                                        {user ?
                                                            <AiFillDislike className="text-danger fs-24 ml-1 cursor-pointer" onClick={this.handleJaimePasVideo} title="Je n'aime pas ce contenu" /> :
                                                            <AiFillDislike className="text-danger fs-24 ml-1" />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="bg-green" />
                                            <div className="row">
                                                <Link to="/chaine" className="col-1 d-flex justify-content-center color-green text-decoration-none">
                                                    <div>
                                                        {item.avatar !== null ?
                                                            <img src={item.avatar} alt="avatar" /> :
                                                            <img src={Utils.prefixLogo + "logo_DailyTube.png"} alt="avatar" />
                                                        }
                                                    </div>
                                                </Link>
                                                <div className="col-9">
                                                    <p className="h5 m-0">
                                                        <Link to="/chaine" className="color-green text-decoration-none">
                                                            {item.pseudo_User}
                                                        </Link>
                                                    </p>
                                                    <p className="text-white">
                                                        {abonnes} abonnés
                                                    </p>
                                                    <p className="text-white">
                                                        {item.description_Video}
                                                    </p>
                                                </div>
                                                {user && <div className="col-2">
                                                    <Button variant="outline-green" onClick={this.handleClickAbonner}>
                                                        {this.state.abonner ?
                                                            "ABONNÉ" :
                                                            "S'ABONNER"
                                                        }
                                                    </Button>
                                                </div>}
                                            </div>
                                            <hr className="bg-green" />
                                            {user &&
                                                <div className="row">
                                                    <Link to="/chaine" className="col-1 d-flex justify-content-center color-green text-decoration-none">
                                                        <div>
                                                            {user.avatar !== null ?
                                                                <img src={user.avatar} alt="avatar" /> :
                                                                <img src={Utils.prefixLogo + "logo_DailyTube.png"} alt="avatar" style={{ width: 50 }} />
                                                            }
                                                        </div>
                                                    </Link>
                                                    <Form className="col-11">
                                                        <Form.Group>
                                                            <Form.Control id="textarea-commentaire" name="commentaire" ref={this.commentaireRef} as="textarea" rows="3" style={{ resize: 'none' }} onKeyPress={this.handleKeypress} />
                                                        </Form.Group>
                                                    </Form>
                                                </div>
                                            }
                                        </div>
                                    );
                                })
                            }

                            {/* Commentaire */}
                            <InfiniteScroll
                                dataLength={this.state.showCommentaire.length}
                                next={this.fetchMoreDataCommentaire}
                                hasMore={true}
                            >
                                {showCommentaire.length > 0 ?
                                    showCommentaire.map(item => {
                                        if (item.active_Commentaire === 1) {
                                            let date = new Date(item.date_Commentaire);
                                            date = Utils.writeDateSimple(date);
                                            let jaime = Utils.writeNumber(item.jaime_Commentaire);
                                            let jaimePas = Utils.writeNumber(item.jaime_pas_Commentaire);
                                            const idCommentaire = item.id_Commentaire;

                                            return (
                                                <div key={item.id_Commentaire}>
                                                    <div className="row">
                                                        <Link to="/chaine" className="col-1 d-flex justify-content-center color-green text-decoration-none">
                                                            <div>
                                                                {item.avatar !== null ?
                                                                    <img src={item.avatar} alt="avatar" /> :
                                                                    <img src={Utils.prefixLogo + "logo_DailyTube.png"} alt="avatar" style={{ width: 50 }} />
                                                                }
                                                            </div>
                                                        </Link>
                                                        <div className="col-9">
                                                            <p className="h5 m-0">
                                                                <Link to="/chaine" className="color-green text-decoration-none">
                                                                    {item.pseudo_User}
                                                                </Link>
                                                            </p>
                                                            <p className="text-white mb-1">
                                                                {item.texte_Commentaire}
                                                            </p>
                                                            <p className="text-white">
                                                                <span className="mr-3">{date}</span>
                                                                <span className="mr-3">{jaime}
                                                                    {user ?
                                                                        <AiFillLike className="color-green fs-24 ml-1 cursor-pointer" onClick={this.handleJaimeCommentaire} title="J'aime" /> :
                                                                        <AiFillLike className="color-green fs-24 ml-1" />
                                                                    }
                                                                </span>
                                                                <span>{jaimePas}
                                                                    {user ?
                                                                        <AiFillDislike className="text-danger fs-24 ml-1 cursor-pointer" onClick={this.handleJaimePasCommentaire} title="Je n'aime pas" /> :
                                                                        <AiFillDislike className="text-danger fs-24 ml-1" />
                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Affichage reponse */}
                                                    {reponse.map(item => {
                                                        if (item.active_Reponse === 1 && item.id_Commentaire === idCommentaire) {
                                                            let date = new Date(item.date_Reponse);
                                                            date = Utils.writeDateSimple(date);

                                                            return (
                                                                <div key={reponse.id_Reponse} className="row ml-5">
                                                                    <Link to="/chaine" className="col-1 d-flex justify-content-center color-green text-decoration-none">
                                                                        <div>
                                                                            <img className="w-75" src={item.avatar} alt="avatar" />
                                                                        </div>
                                                                    </Link>
                                                                    <div className="col-9">
                                                                        <p className="h5 m-0">
                                                                            <Link to="/chaine" className="color-green text-decoration-none">
                                                                                {item.pseudo_User}
                                                                            </Link>
                                                                        </p>
                                                                        <p className="text-white mb-1">
                                                                            {item.texte_Reponse}
                                                                        </p>
                                                                        <p className="text-white">
                                                                            <span className="mr-3">{date}</span>
                                                                        </p>
                                                                    </div>
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
                                            return false;
                                        }
                                    }) :
                                    <div className="text-center color-green">
                                        Cette vidéo ne possède pas de commentaires. Soyez le premier !
                                    </div>
                                }
                            </InfiniteScroll>
                        </div>

                        {/* Div proposition de vidéo (droite) */}
                        <div id="list-video" className="col-3 d-flex flex-column align-items-center">
                            <InfiniteScroll
                                dataLength={showAll.length}
                                next={this.fetchMoreDataAll}
                                hasMore={true}
                            >
                                {showAll.map(item => {
                                    let date = new Date(item.date_Video);
                                    let jour = date.getDate();
                                    let mois = date.getMonth() + 1;
                                    let annee = date.getFullYear();
                                    if (jour < 10) {
                                        jour = '0' + jour;
                                    }
                                    if (mois < 10) {
                                        mois = '0' + mois;
                                    }
                                    date = `${jour}/${mois}/${annee}`;
                                    let vues = Utils.writeNumber(item.nb_vue);
                                    return (
                                        <div key={item.id_Video} className="mb-4">
                                            <CardVideo item={item} vues={vues} date={date} />
                                        </div>
                                    );
                                })}
                            </InfiniteScroll>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div className="vh-100 d-flex align-items-center" style={{ marginTop: -80 }}>
                        <Alert variant='warning' className='text-center w-100'>
                            Vidéo indisponible.
                        </Alert>
                    </div>
                );
            }
        }
        else {
            return (
                <>
                    <Redirect to="/video" />
                </>
            );
        }
    }
}

export default withRouter(Video);