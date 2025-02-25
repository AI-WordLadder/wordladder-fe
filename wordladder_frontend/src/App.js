import './App.css';
import { Component , createRef } from 'react';

const heuristic = {
  technique: "A* Search",
  startword: "NEED",
  endword: "WHEN",
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
      wordlength : heuristic.startword.length
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
    else if (key === 'Enter') {
      this.setState((prevState) => ({
        text: prevState.text + '\n', // Add a new line
      }));
    }
    else if (/[a-zA-Z]/.test(key)) {
      // Allow only letters (A-Z, a-z)
      this.setState((prevState) => ({
        text: prevState.text + key.toUpperCase(), // Convert to uppercase
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
    let textareas = []; // Create an empty array

    // Use for loop to push textarea elements
    for (let i = 0; i < this.state.wordlength; i++) {
      if (i === 0){
        textareas.push(<textarea className="block currentBlock"readOnly></textarea>);
      }
      else{
        textareas.push(<textarea className="block"readOnly></textarea>);
      }
    }


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
          <div className="textarea input"> {textareas}
            {/* version 1 */}
            {/* {this.state.text.split('').map((char) => (
                <textarea
                  value={char}
                  className=""
                  readOnly
                >
                  {char}
                </textarea>
              ))}   */}
              {/* version 2 */}             
              {/* <textarea ref={this.textAreaRef} className={this.state.text ? "textarea input filled" : "textarea input current"} value={this.state.text} readOnly></textarea>
              <textarea class="" value={this.state.text} readOnly></textarea>
              <textarea class="" value={this.state.text} readOnly></textarea> */}
          </div>
          <div className="textarea input"> {textareas}</div>
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

// import { useState } from "react";

// function TextAreaList() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [textareas, setTextareas] = useState(["", "", "", "", ""]); // มี 5 Textareas

//   const handleNext = () => {
//     if (currentIndex < textareas.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handleChange = (index, newValue) => {
//     const updatedTextareas = [...textareas]; // Copy array
//     updatedTextareas[index] = newValue; // อัปเดตค่าเฉพาะอันที่ต้องการ
//     setTextareas(updatedTextareas);
//   };

//   return (
//     <div>
//       {textareas.map((text, i) => (
//         <textarea
//           key={i}
//           className={i === currentIndex ? "Current" : i < currentIndex ? "Filled" : ""}
//           value={text} // ผูกค่ากับ state
//           onChange={(e) => handleChange(i, e.target.value)} // อัปเดตค่าเฉพาะอันที่แก้ไข
//           readOnly={i !== currentIndex} // อนุญาตให้พิมพ์ได้เฉพาะอันที่เป็น "Current"
//         />
//       ))}
//       <button onClick={handleNext}>Next</button>
//     </div>
//   );
// }

// export default TextAreaList;
