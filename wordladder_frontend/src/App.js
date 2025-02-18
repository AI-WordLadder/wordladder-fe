import './App.css';
import { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '', // Store textarea content
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (event) => {
    const { key } = event;
    
    if (key === 'Backspace') {
      this.handleDelete(); // Delete character when pressing Backspace
    }
    else if (/[a-zA-Z]/.test(key)) {
      // Allow only letters (A-Z, a-z)
      this.setState((prevState) => ({
        text: prevState.text + key.toUpperCase(), // Convert to uppercase
      }));
    } else if (key === 'Enter') {
      this.setState((prevState) => ({
        text: prevState.text + '\n', // Add a new line
      }));
    }
  };

  handleButtonClick = (char) => {
    this.setState((prevState) => ({
      text: prevState.text + char,
    }));
  };

  handleDelete = () => {
    this.setState((prevState) => ({
      text: prevState.text.slice(0, -1), // Remove the last character
    }));
  };

  render() {
    return (
      <div className="container">
        <div className="textarea">
          <textarea value={this.state.text} readOnly></textarea>
        </div>
        <div className="keyboard">
          <div className="keyboardRow">
            {'QWERTYUIOP'.split('').map((char) => (
              <button
                key={char}
                className="button characterButton"
                onClick={() => this.handleButtonClick(char)}
              >
                {char}
              </button>
            ))}
          </div>
          <div className="keyboardRow">
            <div className="keyboardSpacer"></div>
            {'ASDFGHJKL'.split('').map((char) => (
              <button
                key={char}
                className="button characterButton"
                onClick={() => this.handleButtonClick(char)}
              >
                {char}
              </button>
            ))}
            <div className="keyboardSpacer"></div>
          </div>
          <div className="keyboardRow">
            <button className="button enterButton" onClick={() => this.handleButtonClick('\n')}>
              Enter
            </button>
            {'ZXCVBNM'.split('').map((char) => (
              <button
                key={char}
                className="button characterButton"
                onClick={() => this.handleButtonClick(char)}
              >
                {char}
              </button>
            ))}
            <button className="button deleteButton" onClick={this.handleDelete}>
              <img
                src="https://static-00.iconduck.com/assets.00/backspace-icon-2048x1509-3pqr8k29.png"
                alt="-"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <Header />
    </div>
  );
}

export default App;
