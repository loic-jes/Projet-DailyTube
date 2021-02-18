import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { FaFacebookSquare, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LanguageContext from '../context/LanguageContext';
import Utils from '../Utils';

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            terms: {
                presentation: 'Présentation',
                droits: "Droits d'auteur",
                contact: 'Nous contacter',
                conditions: "Conditions d'utilisation",
                confidentialite: 'Confidentialité',
                regles: 'Règles et sécurité',
                langue: 'Langue',
                reseaux: 'Nos réseaux sociaux'
            }
        }
    }

    static contextType = LanguageContext;

    handleClickLanguage(e){
        const { setLanguage } = this.context;
        setLanguage(e.target.title);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
            if (this.props.language === 'Français') {
                this.setState({
                    terms: {
                        presentation: 'Présentation',
                        droits: "Droits d'auteur",
                        contact: 'Nous contacter',
                        conditions: "Conditions d'utilisation",
                        confidentialite: 'Confidentialité',
                        regles: 'Règles et sécurité',
                        langue: 'Langue',
                        reseaux: 'Nos réseaux sociaux'
                    }
                });
            }
            else {
                this.setState({
                    terms: {
                        presentation: 'Presentation',
                        droits: "Copyright",
                        contact: 'Contact us',
                        conditions: "Terms of use",
                        confidentialite: 'Confidentiality',
                        regles: 'Rules and security',
                        langue: 'Language',
                        reseaux: 'Our social networks'
                    }
                });
            }
        }
    }

    render() {
        return (
            <Navbar bg="black" expand="lg" className="d-flex justify-content-between">
                <div>
                    <img src={Utils.prefixLogo + "logo_DailyTube.png"} alt="Logo" className="logo-footer" />
                    <p className="color-green text-center">© 2020 DailyTube</p>
                </div>
                <Nav>
                    <ul>
                        <li>
                            <Nav.Link as="div">
                                <Link to="/presentation" className="color-green text-decoration-none navlink-footer">
                                    {this.state.terms.presentation}
                                </Link>
                            </Nav.Link>
                        </li>
                        <li>
                            <Nav.Link as="div">
                                <Link to="/droit" className="color-green text-decoration-none navlink-footer">
                                {this.state.terms.droits}
                                </Link>
                            </Nav.Link>
                        </li>
                        <li>
                            <Nav.Link as="div">
                                <Link to="/contacter" className="color-green text-decoration-none navlink-footer">
                                {this.state.terms.contact}
                                </Link>
                            </Nav.Link>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <Nav.Link as="div">
                                <Link to="/condition" className="color-green text-decoration-none navlink-footer">
                                {this.state.terms.conditions}
                                </Link>
                            </Nav.Link>
                        </li>
                        <li>
                            <Nav.Link as="div">
                                <Link to="/confidentialite" className="color-green text-decoration-none navlink-footer">
                                {this.state.terms.confidentialite}
                                </Link>
                            </Nav.Link>
                        </li>
                        <li>
                            <Nav.Link as="div">
                                <Link to="/regle" className="color-green text-decoration-none navlink-footer">
                                {this.state.terms.regles}
                                </Link>
                            </Nav.Link>
                        </li>
                    </ul>
                </Nav>
                <Nav className="flex-column text-center">
                    <Navbar.Text className="navbar-title">
                    {this.state.terms.langue}
                    </Navbar.Text>
                    <div className="d-flex justify-content-center">
                        <div style={{ display: "inline", marginRight: 20 }}>
                            <img className="logo-language" src={Utils.prefixLogo + "france-icon.png"} alt="Icon Français" title="Français" onClick={this.handleClickLanguage.bind(this)}/>
                        </div>
                        <div className="d-flex align-content-center">
                            <img className="logo-language" src={Utils.prefixLogo + "english-icon.png"} alt="Icon English" title="English" onClick={this.handleClickLanguage.bind(this)}/>
                        </div>
                    </div>
                    <Navbar.Text className="navbar-title">
                    {this.state.terms.reseaux}
                    </Navbar.Text>
                    <div className="d-flex justify-content-center">
                        <Nav.Link href="https://fr-fr.facebook.com/" target="_blank" style={{ display: "inline", marginRight: 20 }}>
                            <FaFacebookSquare className="font-reseaux" style={{ color: '#3b5998' }} />
                        </Nav.Link>
                        <Nav.Link href="https://twitter.com/?lang=fr" target="_blank">
                            <FaTwitter className="font-reseaux" style={{ color: '#00aced' }} />
                        </Nav.Link>
                    </div>
                </Nav>
            </Navbar>
        );
    }
}

export { Footer };