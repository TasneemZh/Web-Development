import React from "react";
import axios from "axios";

class App extends React.Component {
constructor(props) {
  super(props);
this.state = {
  message: '',
  msgSent: false,
  error: null
}
}

handleFormSubmit = e => {
  e.preventDefault();
  axios({
    method: 'post',
    url: `${process.env.REACT_APP_API}`,
    headers: { 'content-type': 'application/json' },
    data: this.state
  })
    .then(result => {
      this.setState({
        msgSent: result.data.sent
      })
    })
    .catch(error => this.setState({ error: error.message }));
};

render() {
  return (
    <div className="App container position-absolute top-50 start-50 translate-middle">
    <p>Write For Me</p>
    <div>

<form action="#" >
  <label>Message</label>
  <textarea id="message" name="message" placeholder="Write something.."
    onChange={e => this.setState({ message: e.target.value })}
    value={this.state.message}
  ></textarea>
  <input type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />

  <div>
  {this.state.msgSent &&
    <div>Thank you for your message.</div>
  }
</div>

</form >

    </div>
    </div>
  );
}
}

export default App;
