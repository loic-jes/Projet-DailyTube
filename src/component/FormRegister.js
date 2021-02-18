import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Rest from '../Rest';

class FormRegister extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showErr: false,
            msgErr: ''
        };
    }


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
                errMinPassword: "Veuillez inscrire un mot de passe avec 8 caractères minimum.",
                errConfPassword: "Mot de passe incorrect.",
                errEmail: "Veuillez inscrire une adresse email valide.",
                errRequired: "Veuillez remplir ce champ.",
                nom: 'Votre nom',
                prenom: 'Votre prénom',
                pseudo: 'Votre pseudo',
                dateNaissance: 'Votre date de naissance',
                image: 'Choisissez votre image de profil : *',
                format: 'Formats supportés : JPEG, JPG, PNG',
                email: "Votre email",
                password: "Votre mot de passe",
                confPassword: 'Confirmer votre mot de passe',
                ref: '* Champ NON obligatoire',
                inscription: 'Inscription'
            }
        }
        else {
            terms = {
                errMaxNom: "Please enter a name with less than 35 characters",
                errMaxPrenom: "Please enter a first name with less than 25 characters",
                errMaxPseudo: "Please enter a nickname with less than 50 characters",
                errFormat: "Please select a correct image format.",
                errMinPassword: "Please enter a password with at least 8 characters.",
                errConfPassword: "Incorrect password.",
                errEmail: "Please enter a valid email address.",
                errRequired: "Please fill in this field.",
                nom: 'Your name',
                prenom: 'Your first name',
                pseudo: 'Your username',
                dateNaissance: 'Your birthdate :',
                image: 'Choose your profile picture: *',
                format: 'Supported formats: JPEG, JPG, PNG',
                email: "Your email",
                password: "Your password",
                confPassword: 'Confirm your password',
                ref: '* Field NOT mandatory',
                inscription: 'Registration'
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
                .required(terms.errRequired),
            password: Yup.string()
                .min(8, terms.errMinPassword)
                .required(terms.errRequired),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], terms.errConfPassword)
                .required(terms.errRequired)
        });

        return (
            <>
                <Formik
                    initialValues={{
                        nom: "",
                        prenom: "",
                        pseudo: "",
                        dateNaissance: "",
                        avatar: "",
                        email: "",
                        password: "",
                        confirmPassword: ""
                    }}
                    validationSchema={registerSchema}
                    onSubmit={values => {
                        console.log(values);
                        let date = new Date();
                        let currentTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                        const body = {
                            table: 'user',
                            url: 'register',
                            params: {
                                nom_User: values.nom,
                                prenom_User: values.prenom,
                                pseudo_User: values.pseudo,
                                date_naissance: values.dateNaissance,
                                date_inscription: currentTime,
                                avatar: (values.avatar !== '' ? values.avatar : null),
                                email: values.email,
                                password: values.password,
                                active_User: 0,
                                valide_User: 1,
                                id_Role: 1
                            }
                        };
                        Rest.apiRequest(body, 'POST').then(resp => resp.text())
                            .then(resp => {
                                try {
                                    resp = JSON.parse(resp);
                                    if (resp) {
                                        if (resp === 'pseudo exist') {
                                            this.setState({
                                                showErr: true, msgErr: (this.props.language === 'Français' ?
                                                    "Ce pseudo n'est pas disponible, veuillez en saisir un autre." :
                                                    "This username is not available, please enter a different one.")
                                            });
                                        }
                                        else if (resp === 'email exist') {
                                            this.setState({
                                                showErr: true, msgErr: (this.props.language === 'Français' ?
                                                    "Un compte existe avec cet email." :
                                                    "An account exists with this email.")
                                            });
                                        }
                                        else {
                                            this.props.handleClick();
                                        }
                                    }
                                    else {
                                        this.props.handleClick(true);
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            });
                        // this.moveAvatar(values.avatar);
                    }}
                >
                    {({ errors, touched }) => (
                        <Form className="mt-4">
                            <div className="form-group">
                                <Field name="nom" className="form-control" placeholder={terms.nom} />
                                {this.showStatutMsg(errors, touched, "nom")}
                            </div>
                            <div className="form-group mt-5">
                                <Field name="prenom" className="form-control" placeholder={terms.prenom} />
                                {this.showStatutMsg(errors, touched, "prenom")}
                            </div>
                            <div className="form-group mt-5">
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
                            <div className="form-group mt-5">
                                <Field type="email" name="email" className="form-control" placeholder={terms.email} />
                                {this.showStatutMsg(errors, touched, "email")}
                            </div>
                            <div className="form-group mt-5">
                                <Field type="password" name="password" className="form-control" placeholder={terms.password} />
                                {this.showStatutMsg(errors, touched, "password")}
                            </div>
                            <div className="form-group mt-5 mb-4">
                                <Field type="password" name="confirmPassword" className="form-control" placeholder={terms.confPassword} />
                                {this.showStatutMsg(errors, touched, "confirmPassword")}
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

export { FormRegister };