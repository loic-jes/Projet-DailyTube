import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { FaTimesCircle } from 'react-icons/fa';
import Rest from '../Rest';

class FormLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msgErr: false,
            msgNotActive: false
        }
    }

    static contextType = UserContext;

    createTextLanguage() {
        let terms;
        if (this.props.language === 'Français') {
            terms = {
                errEmail: "Veuillez inscrire une adresse mail valide.",
                errRequired: "Veuillez remplir ce champ.",
                email: "Votre email",
                password: "Votre mot de passe",
                connexion: 'Connexion',
                souvenir: 'Se souvenir de moi',
                msgErr: 'Email ou mot de passe incorrect.',
                msgNotActive: "Votre compte n'est pas activer"
            }
        }
        else {
            terms = {
                errEmail: "Please enter a valid email address.",
                errRequired: "Please fill in this field.",
                email: "Your email",
                password: "Your password",
                connexion: 'Login',
                souvenir: 'Remember me',
                msgErr: 'Incorrect email or password.',
                msgNotActive: "Your account is not activated"
            }
        }
        return terms;
    }

    render() {
        let terms = this.createTextLanguage();

        const loginSchema = Yup.object().shape({
            email: Yup.string()
                .email(terms.errEmail)
                .required(terms.errRequired),
            password: Yup.string()
                .required(terms.errRequired)
        });

        return (
            <>
                <Formik
                    initialValues={{
                        email: "",
                        password: ""
                    }}
                    validationSchema={loginSchema}
                    onSubmit={values => {
                        const { setUser } = this.context;
                        const body = { email: values.email, password: values.password };
                        Rest.apiRequest(body, 'POST', true).then(resp => resp.text())
                            .then(resp => {
                                try {
                                    resp = JSON.parse(resp);
                                    if (resp) {
                                        if (resp === 'not active') {
                                            this.setState({ msgNotActive: true });
                                        }
                                        else {
                                            let user = resp.user;
                                            setUser(user);
                                            localStorage.setItem('token', resp.token);
                                            if (values.remember) {
                                                localStorage.setItem('user', user.id_User);
                                            }
                                            this.props.handleClick();
                                        }
                                    }
                                    else {
                                        this.setState({ msgErr: true });
                                    }
                                }
                                catch (e) {
                                    console.log(resp);
                                    console.log('Erreur:' + e);
                                }
                            })
                    }}
                >
                    {({ errors, touched }) => (
                        <Form className="mt-4">
                            <div className="form-group">
                                <Field type="email" name="email" className="form-control" placeholder={terms.email} />
                                {errors.email && touched.email ? (
                                    <small className="position-absolute text-danger d-flex align-items-center">
                                        <FaTimesCircle />&nbsp;{errors.email}
                                    </small>
                                ) : null}
                            </div>
                            <div className="form-group mt-5">
                                <Field type="password" name="password" className="form-control" placeholder={terms.password} />
                                {errors.password && touched.password ? (
                                    <small className="position-absolute text-danger d-flex align-items-center">
                                        <FaTimesCircle />&nbsp;{errors.password}
                                    </small>
                                ) : null}
                            </div>
                            <div className="form-check mt-4">
                                <Field type="checkbox" name="remember" className="form-check-input" />
                                <label htmlFor="remember" className="form-check-label color-green">{terms.souvenir}</label>
                            </div>
                            {this.state.msgErr ? <small className="text-danger">{terms.msgErr}</small> : null}
                            {this.state.msgNotActive ? <small className="text-danger">{terms.msgNotActive}</small> : null}
                            <Button variant="green" type="submit" className="w-100 mt-4">
                                {terms.connexion}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }
}

export { FormLogin };