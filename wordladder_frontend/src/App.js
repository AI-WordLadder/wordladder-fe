import './App.css';
import axios from 'axios'
import { Component , createRef,useState,useEffect } from 'react';

// let row = [];
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '', // Store textarea content
      startword: props.heuristic.startword, // ต้องใช้ props.heuristic
      endword: props.heuristic.endword,
      wordlength: props.heuristic.startword.length,
      
    };
    this.textAreaRef = createRef(); // สร้าง ref
  }
  
  //variable

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
    //   let textareas = []; // Create an empty array
    //   // Use for loop to push textarea elements
    //   for (let i = 0; i < this.state.startword.length; i++) {
    //     if (i === 0){
    //       textareas.push(<textarea className="block currentBlock"readOnly></textarea>);
    //     }
    //     else{
    //       textareas.push(<textarea className="block"readOnly></textarea>);
    //     }
    //   }
    //   row.push(<div class="row">{textareas}</div>)
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
    // this.fetchData();
    const  {heuristic } = this.props; // ✅ รับ props มาใช้ใน render
    let textareas = []; // Create an empty array
    let row = '';
    // Use for loop to push textarea elements
    for (let i = 0; i < heuristic.startword.length; i++) {
      if (i === 0){
        textareas.push(<textarea className="block currentBlock"readOnly></textarea>);
      }
      else{
        textareas.push(<textarea className="block"readOnly></textarea>);
      }
    }
    row = <div class="row">{textareas}</div>


    return (
      <div className="container">
        <div class="gameplay">
          <div className="textarea startword">      
            {heuristic.startword.split('').map((char) => (
              <textarea
                value={char}
                className=""
                readOnly
              >
                {char}
              </textarea>
            ))}      
          </div>
          <div className="textarea input">{row}{row}
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
          {/* <div className="textarea input"> {row}</div> */}
          <div className="textarea endword">
            {heuristic.endword.split('').map((char) => (
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
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/game?length=3&blind=bfs&heuristoc=astar");
        setData(response.data);
        console.log("Fetched Data:", response.data); // 🔹 Print ข้อมูลที่ได้จาก API
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []); // รันแค่ครั้งเดียวตอน component โหลด

  return (
    <div>
      {data && <Header heuristic={data.heuristic} />}
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
