import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header, Main, Footer } from './component';
import { BrowserRouter as Router } from "react-router-dom";
import { LanguageProvider } from './context';
import LanguageContext from './context/LanguageContext';
import { Component } from 'react';
import UserContext from './context/UserContext';

class App extends Component {

  static contextType = UserContext;

  render() {
    return (
      <div className="App">
        <LanguageProvider>
          <Router>
            <header>
              <LanguageContext.Consumer>
                {({ language }) =>
                  <Header language={language} />
                }
              </LanguageContext.Consumer>
            </header>
            <main style={{ marginTop: 80 }}>
              <Main />
            </main>
            <footer style={{marginTop: 30 }}>
              <LanguageContext.Consumer>
                {({ language }) =>
                  <Footer language={language} />
                }
              </LanguageContext.Consumer>
            </footer>
          </Router>
        </LanguageProvider>
      </div>
    );
  }
}

export default App;

// $(function () {
//   $('.dropdown').on('show.bs.dropdown', function (e) {
//     $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
//   });

//   // ADD SLIDEUP ANIMATION TO DROPDOWN //
//   $('.dropdown').on('hide.bs.dropdown', function (e) {
//     e.preventDefault();
//     $(this).find('.dropdown-menu').first().stop(true, true).slideUp(400, function () {
//       $('.dropdown').removeClass('show');
//       $('.dropdown-menu').removeClass('show');
//       $('.dropdown').find('.dropdown-toggle').attr('aria-expanded', 'false');
//     });
//   });
// });