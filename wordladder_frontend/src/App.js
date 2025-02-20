import './App.css';
import { Component, useState , createRef } from 'react';

const heuristic = {
  technique: "A* Search",
  startword: "sea",
  endword: "bee",
  optimal: 12,
  path: ["reseal", "reseat", "resent", "resend", "reseed", "rested", "tested", "tasted", "tauted", "dauted", "daubed", "dabbed", "dubbed"],
  space: "0.45 KB",
  time: "0.1160 sec"
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '', // Store textarea content
      startword: heuristic.startword,
      endword: heuristic.endword,
    };
    this.textAreaRef = createRef(); // สร้าง ref

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
        <div class="gameplay">
          <div className="textarea startword">      
            {this.state.startword.split('').map((char) => (
              <textarea
                value={char}
                className=""
                readOnly
              >
                {char}
              </textarea>
            ))}      
          </div>
          <div className="textarea input">           
            <textarea ref={this.textAreaRef} className={this.state.text ? "textarea input filled" : "textarea input current"} value={this.state.text} readOnly></textarea>
            <textarea class="" value={this.state.text} readOnly></textarea>
            <textarea class="" value={this.state.text} readOnly></textarea>
          </div>
          <div className="textarea endword">
            {this.state.endword.split('').map((char) => (
                <textarea
                  value={char}
                  className=""
                  readOnly
                >
                  {char}
                </textarea>
              ))}            
          </div>
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
      <Header/>
    </div>
  );
}

export default App;


// -----------------------------------------------------------------------------------------------------------------------


// import React, { Component, createRef } from "react";

// class TextAreaComponent extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { text: "", word : "e" };
//     this.textAreaRef = createRef(); // สร้าง ref
//   }

//   checkClassName = () => {
//     if (this.textAreaRef.current) {
//       console.log(this.textAreaRef.current.classList.contains("filled")); // true หรือ false
//     }
//   };

//   render() {
//     return (
//       <div>
//         <textarea
//           ref={this.textAreaRef}
//           className={this.state.text ? "filled" : "current"}
//           // value={ this.state.text}
//           value={ this.state.text}
//           onChange={(e) => this.setState({ text: e.target.value })}
//           placeholder="Type something..."
//         ></textarea>
//         {/* <button onClick={this.checkClassName}>Check Class</button> */}
//       </div>
//     );
//   }
// }

// export default TextAreaComponent;
