import React, { Component } from 'react';
import UserContext from "../../../context/UserContext";
import Rest from "../../../Rest";
import { TextAreaForm } from './TextAreaForm'


class Apropos extends Component {

    constructor(props) {
        super(props);
        this.state = { nbVideos: 0, nbVuesTotal: 0, desc: this.props.desc }
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(e, props) {
        this.setState({ desc: e.value })
        this.props.onValueChange(e.value);
    }

    static contextType = UserContext;

    componentDidMount() {

        // const { user } = this.context

        Rest.apiRequest({ table: "chaine", idchaine: this.props.idChaine, action: "videos",  }).then(resp => resp.text())
            .then((resp) => {
                try {
                    resp = JSON.parse(resp)
                    this.setState({ nbVideos: resp.length })
                    let nbVuesTotal = 0
                    for (let i = 0; i < resp.length; i++) {
                        nbVuesTotal += Number(resp[i].nb_vue)
                    }
                    this.setState({ nbVuesTotal: nbVuesTotal })
                }
                catch { }
            })
    }
    render() {

        const { user } = this.context
        let dateInscription = new Date(user.date_inscription);

        return (
            <div className="ml-2 mt-5 row" >
                <div className="col-9">
                    <h3>Description de la chaîne</h3>
                    <div className="w-100">
                        <TextAreaForm value={this.state.desc} idChaine={this.props.idChaine} event="modifDescription" onValueChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="col-3">
                    <div className="mt-3 ml-5">
                        <h6 className="mt-2">Actif depuis le</h6> <span> {dateInscription.getDate() < 10 ? "0" + dateInscription.getDate() : dateInscription.getDate()}/{Number(dateInscription.getMonth()) + 1 < 10 ? "0" + (Number(dateInscription.getMonth()) + 1) : Number(dateInscription.getMonth()) + 1}/{dateInscription.getFullYear()}</span>
                        <h6 className="mt-2">Nombre de vidéos postées</h6> <span> {this.state.nbVideos}</span>
                        <h6 className="mt-2">Nombre de vues sur la totalité des vidéos</h6> <span> {this.state.nbVuesTotal}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export { Apropos };