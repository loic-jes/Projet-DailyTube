import React, { Component } from 'react';

const LanguageContext = React.createContext();

class LanguageProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            language: 'Français',
        }
    }

    setLanguage = (language) => {
        this.setState({language});
        localStorage.setItem('language', language);
    }

    componentDidMount(){
        if(localStorage.getItem('language') != null){
            this.setLanguage(localStorage.getItem('language'));
        }
    }
    
    render() {
        const { children } = this.props;
        const { language } = this.state;
        const { setLanguage } = this;
        return (
            <LanguageContext.Provider
                value={{
                    language,
                    setLanguage
                }}    
            >
                {children}
            </LanguageContext.Provider>
        );
    }
}

export { LanguageProvider };

export default LanguageContext;