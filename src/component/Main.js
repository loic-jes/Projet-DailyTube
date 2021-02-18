import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Accueil, Abonnement, Chaine, Video, Compte, MaChaine, Playlist, Upload, ErrorView, Activation } from './page';
import ProtectedRoute from './ProtectedRoute';

class Main extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/">
                        <Accueil />
                    </Route>
                    <ProtectedRoute path="/abonnement" component={Abonnement} />
                    <ProtectedRoute path="/playlist" component={Playlist} />
                    <Route path="/chaine">
                        <Chaine />
                    </Route>
                    <Route path="/video/:id">
                        <Video />
                    </Route>
                    <Route path="/activation/:token">
                        <Activation />
                    </Route>
                    <ProtectedRoute path="/compte" component={Compte} />
                    <ProtectedRoute path="/machaine" component={MaChaine} />
                    <ProtectedRoute path="/upload" component={Upload} />
                    <Route path="*">
                        <ErrorView />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export { Main };