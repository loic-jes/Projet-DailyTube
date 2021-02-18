import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Rest from "../../../Rest";
import UserContext from "../../../context/UserContext";


class ChangeInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showErr: false,
            msgErr: ''
        };
    }

    static contextType = UserContext;

    showStatutMsg(errors, touched, name) {
        if (errors[name] && touched[name]) {
            return (
                <small className="position-absolute text-danger">
                    <FaTimesCircle />&nbsp;{errors[name]}
                </small>
            );
        }
        if (!errors[name] && touched[name]) {
            if (this.props.language === 'Français') {
                return (
                    <small className="position-absolute text-success">
                        <FaCheckCircle />&nbsp;Champ valide
                    </small>
                );
            }
            else {
                return (
                    <small className="position-absolute text-success">
                        <FaCheckCircle />&nbsp;Valid field
                    </small>
                );
            }
        }
        return null;
    }

    createTextLanguage() {
        let terms;
        if (this.props.language === 'Français') {
            terms = {
                errMaxNom: "Veuillez inscrire un nom avec moins de 35 caractères",
                errMaxPrenom: "Veuillez inscrire un prénom avec moins de 25 caractères",
                errMaxPseudo: "Veuillez inscrire un pseudo avec moins de 50 caractères",
                errFormat: "Veuillez sélectionner un bon format d'image.",
                errEmail: "Veuillez inscrire une adresse email valide.",
                errRequired: "Veuillez remplir ce champ.",
                nom: 'Votre nom',
                prenom: 'Votre prénom',
                pseudo: 'Votre pseudo',
                dateNaissance: 'Votre date de naissance',
                image: 'Choisissez votre image de profil : *',
                format: 'Formats supportés : JPEG, JPG, PNG',
                email: "Votre email",
                ref: '* Champ NON obligatoire',
                inscription: 'Valider les changements'
            }
        }
        else {
            terms = {
                errMaxNom: "Please enter a name with less than 35 characters",
                errMaxPrenom: "Please enter a first name with less than 25 characters",
                errMaxPseudo: "Please enter a nickname with less than 50 characters",
                errFormat: "Please select a correct image format.",
                errEmail: "Please enter a valid email address.",
                errRequired: "Please fill in this field.",
                nom: 'Your name',
                prenom: 'Your first name',
                pseudo: 'Your username',
                dateNaissance: 'Your birthdate :',
                image: 'Choose your profile picture: *',
                format: 'Supported formats: JPEG, JPG, PNG',
                email: "Your email",
                ref: '* Field NOT mandatory',
                inscription: 'Validate changes'
            }
        }
        return terms;
    }

    // moveAvatar(file){
    //     const moveFile = require('move-file');
    //     (async () => {
    //         await moveFile(file, 'C:/wamp64/www/dailytube/public/asset/img/user/');
    //         console.log('The file has been moved');
    //     })();
    // }

    render() {

        const { user, setUser } = this.context
        let terms = this.createTextLanguage();
        const supportedFormats = [
            'jpg',
            'jpeg',
            'png'
        ];
        const registerSchema = Yup.object().shape({
            nom: Yup.string()
                .max(35, terms.errMaxNom)
                .required(terms.errRequired),
            prenom: Yup.string()
                .max(25, terms.errMaxPrenom)
                .required(terms.errRequired),
            pseudo: Yup.string()
                .max(50, terms.errMaxPseudo)
                .required(terms.errRequired),
            dateNaissance: Yup.date()
                .required(terms.errRequired),
            avatar: Yup.mixed()
                .nullable()
                .test(
                    "fileFormat",
                    terms.errFormat,
                    value => value !== undefined ? supportedFormats.includes(value.substring(value.lastIndexOf('.') + 1)) : true
                ),
            email: Yup.string()
                .email(terms.errEmail)
                .required(terms.errRequired)
        });

        return (
            <>
                <Formik
                    initialValues={{
                        nom: user.nom_User,
                        prenom: user.prenom_User,
                        pseudo: user.pseudo_User,
                        dateNaissance: String(user.date_naissance),
                        avatar: "",
                        email: user.email,

                    }}
                    validationSchema={registerSchema}
                    onSubmit={values => {
                        const body = {
                            table: 'user',
                            params: {
                                nom_User: values.nom,
                                prenom_User: values.prenom,
                                pseudo_User: values.pseudo,
                                date_naissance: values.dateNaissance,
                                avatar: (values.avatar !== '' ? values.avatar : null),
                                email: values.email,
                                active_User: 1,
                                valide_User: 1,
                                id_role: user.id_Role,
                            },
                            id: user.id_User,
                            token: localStorage.getItem("token")
                        };

                        Rest.apiRequest({ table: "user", id: user.id_User, verifyName: values.pseudo }).then(resp => resp.text())  // Vérifies qu'un autre user n'a pas le pseudo dans la base de données
                            .then((resp) => {
                                try {
                                    resp = JSON.parse(resp);
                                    if (!resp[0]) {   // Si jamais il n'y a pas d'autre user avec ce pseudo, on continue et on vérifie le mail    
                                        Rest.apiRequest({ table: "user", id: user.id_User, url: "verify", verifyLogin: values.email }).then(resp => resp.text())  // Vérifies qu'un autre user n'a pas le email dans la base de données
                                            .then((resp) => {
                                                try {
                                                    resp = JSON.parse(resp);
                                                    if (!resp[0]) {  // Si jamais il n'y a pas d'autre user avec ce pseudo ni ce mail, on va faire l'update
                                                        Rest.apiRequest(body, "PUT").then(resp => resp.text())
                                                            .then((resp) => {
                                                                let newInfoUser = {
                                                                    nom_User: values.nom,
                                                                    prenom_User: values.prenom,
                                                                    pseudo_User: values.pseudo,
                                                                    date_naissance: values.dateNaissance,
                                                                    date_inscription: user.date_inscription,
                                                                    avatar: (values.avatar !== '' ? values.avatar : null),
                                                                    email: values.email,
                                                                    active_User: 1,
                                                                    valide_User: 1,
                                                                    id_role: user.id_Role,
                                                                    id_User: user.id_User,
                                                                    id_Chaine: user.id_Chaine
                                                                };
                                                                setUser(newInfoUser)
                                                                alert("Vos informations ont bien été modifiées")
                                                                this.props.onValidation(String(newInfoUser.pseudo_User)) // Fais un setState au parent qui ferme le formulaire
                                                            })
                                                    } else { // Sinon on s'arrête
                                                        alert("Email déjà pris")
                                                    }
                                                } catch (e) { console.log("error", e) }
                                            })
                                    } else { // Sinon on s'arrête
                                        alert("Pseudo déjà pris")
                                    }
                                } catch (e) { console.log("error", e) }
                            })
                    }}
                >
                    {({ errors, touched }) => (
                        <Form className="mt-4">
                            <label htmlFor="nom" className="color-green">
                                {terms.nom}
                            </label>
                            <div className="form-group">
                                <Field name="nom" className="form-control" placeholder={terms.nom} />
                                {this.showStatutMsg(errors, touched, "nom")}
                            </div>
                            <label htmlFor="prenom" className="color-green">
                                {terms.prenom}
                            </label>
                            <div className="form-group">
                                <Field name="prenom" className="form-control" placeholder={terms.prenom} />
                                {this.showStatutMsg(errors, touched, "prenom")}
                            </div>
                            <label htmlFor="pseudo" className="color-green">
                                {terms.pseudo}
                            </label>
                            <div className="form-group">
                                <Field name="pseudo" className="form-control" placeholder={terms.pseudo} />
                                {this.showStatutMsg(errors, touched, "pseudo")}
                            </div>
                            <div className="form-group mt-4">
                                <label htmlFor="dateNaissance" className="color-green">
                                    {terms.dateNaissance}
                                </label>
                                <Field type="date" name="dateNaissance" className="form-control" />
                                {this.showStatutMsg(errors, touched, "dateNaissance")}
                            </div>
                            <div className="form-group mt-4">
                                <label htmlFor="avatar" className="color-green" style={{ margin: 0 }}>
                                    {terms.image}
                                </label>
                                <br />
                                <small className="color-green">
                                    {terms.format}
                                </small>
                                <Field type="file" name="avatar" className="form-control" id="avatar-input" />
                                {this.showStatutMsg(errors, touched, "avatar")}
                            </div>
                            <label htmlFor="email" className="color-green">
                                {terms.email}
                            </label>
                            <div className="form-group">
                                <Field type="email" name="email" className="form-control" placeholder={terms.email} />
                                {this.showStatutMsg(errors, touched, "email")}
                            </div>
                            {this.state.showErr ? <small className="text-danger">
                                <FaTimesCircle /> {this.state.msgErr}
                            </small> : null}
                            <Button variant="green" type="submit" className="w-100 mt-4">
                                {terms.inscription}
                            </Button>
                            <small className="color-green">
                                {terms.ref}
                            </small>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }
}

export { ChangeInfo };