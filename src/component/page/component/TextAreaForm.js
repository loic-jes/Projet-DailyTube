import React from 'react';
import Rest from "../../../Rest";
import UserContext from "../../../context/UserContext";


class TextAreaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static contextType = UserContext;

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onValueChange(event.target, this.props);
  }

  handleSubmit(event) {
    event.preventDefault();
    let evenType = this.props.event
    if (evenType === "modifDescription") {

      Rest.apiRequest({ table: "chaine", params: { description_Chaine: this.state.value }, id: this.props.idChaine, token: localStorage.getItem('token') }, "PUT").then(resp => resp.text())
        .then((resp) => {
          try {
            resp = JSON.parse(resp)
            if (resp === 1) {
              alert("Modification effectuée !")
            }
          }
          catch { }
        })
    }
  }

  render() {

    return (
      <form onSubmit={this.handleSubmit}>
        <label className="w-100">
          <textarea className="w-100" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Modifier" />
      </form>
    );
  }
}

export { TextAreaForm }