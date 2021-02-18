import React, { Component } from 'react';
import UserContext from "../../context/UserContext";
import { Nav, Col } from 'react-bootstrap';
import { Accueil, Apropos, Videos } from './component';
import Rest from "../../Rest";

class MaChaine extends Component {

    constructor(props) {
        super(props);
        this.state = { show: "accueil", nbAbonnes: "", desc: "", idChaine: "" }
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(value) {
        this.setState({ desc: value })
    }

    static contextType = UserContext;

    displayState = () => {

        switch (this.state.show) {
            case "accueil": return (<Accueil idChaine={this.state.idChaine} />);

            case "videos": return (<Videos idChaine={this.state.idChaine} />);

            case "apropos": return (<Apropos desc={this.state.desc} idChaine={this.state.idChaine} event="modifApropos" onValueChange={this.handleInputChange} />);

            default: return null;
        }
    }

    setStateAccueil() {
        this.setState({ show: "accueil" })
    }
    setStateVideos() {
        this.setState({ show: "videos" })
    }
    setStateApropos() {
        this.setState({ show: "apropos" })
    }

    componentDidMount() {

        const { user } = this.context

        Rest.apiRequest({ table: "user", id: user.id_User, action: "chaine" }).then(resp => resp.text())
            .then((resp) => {
                try {
                    resp = JSON.parse(resp)
                    if (resp[0]) {
                        resp = resp[0]
                        this.setState({ idChaine: resp.id_Chaine, desc: resp.description_Chaine, nbAbonnes: resp.nb_abonne, })
                    }
                }
                catch { }
            })
    }


    render() {

        const { user } = this.context

        return (
            <>
                <div className="d-flex align-items-center pt-4 pl-3">
                    <img src={user.avatar} alt="Votre avatar" style={{ maxHeight: 150, maxWidth: 150 }} />
                    <Col className="mt-3">
                        <h3>{user.pseudo_User}</h3>
                        <p>{this.state.nbAbonnes < 1 ? <>{this.state.nbAbonnes} abonné</> : <>{this.state.nbAbonnes} abonnés</>}</p>
                    </Col>
                    {/* <Button variant="primary">Personnaliser la chaîne</Button>
                    <Button variant="primary ml-3 mr-5">Gérer les vidéos</Button> */}
                </div>
                <div className="mt-4">
                    <nav variant="tabs">
                        <Nav variant="tabs" defaultActiveKey="/home">
                            <Nav.Item>
                                <Nav.Link eventKey="link-1" onSelect={this.setStateAccueil.bind(this)}>Accueil</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="link-2" onSelect={this.setStateVideos.bind(this)}>Vidéos</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="link-3" onSelect={this.setStateApropos.bind(this)}>A propos</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </nav>
                </div>
                <div>
                    {this.displayState()}
                </div>
            </>
        );
    }
}

export { MaChaine };