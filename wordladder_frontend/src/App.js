import './App.css';
import axios from 'axios'
import { Component, useState, useEffect, createRef} from 'react';

// ------------------- work version ------------------------------------

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      text: '', // Store textarea content
      startword: props.heuristic.startword, // Props for heuristic
      endword: props.heuristic.endword,
      wordlength: props.heuristic.startword.length,
      rows: [[]], // Store multiple rows of textareas
    };
    this.textAreaRef = createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.heuristic.startword !== this.props.heuristic.startword) {
      this.setState({
        startword: this.props.heuristic.startword,
        endword: this.props.heuristic.endword
      });
    }
    if (this.scrollRef) {
      this.scrollRef.scrollTop = this.scrollRef.scrollHeight; // เลื่อนลงสุด
    }
  }

  checkPrev = (row,rowLength) => {
    if (rowLength === 1){
      return this.state.startword
    }
    else{
      return row[row.length - 2].join('').toLowerCase()
    }
  }

  handleEnter = (event) => {
    // event.preventDefault(); // ป้องกันการขึ้นบรรทัดใหม่ใน input
  
    this.setState((prevState) => {
      const newRows = [...prevState.rows]; // คัดลอก rows ออกมา
      const lastRow = newRows[newRows.length - 1]; // แถวล่าสุด
      const word = lastRow.join('').toLowerCase();
      const prevWord = this.checkPrev(newRows,newRows.length)
      console.log("---- Handle Enter ----")
      console.log(word)
      console.log(prevWord)
      console.log("---- Handle Enter ----")
      if (lastRow.length === this.state.startword.length) { // เช็คว่าแถวล่าสุดมีความยาวเท่ากับ startword หรือยัง
        this.fetchData(word,prevWord)
        return { rows: [...newRows, []] }; // เพิ่มแถวใหม่
      }
      return null; // ไม่เปลี่ยน state ถ้ายังไม่ครบ 3 ตัวอักษร
    });

  };

  fetchData = async (word,prevWord) => {
    const url = `/check?word=${word}&previous=${prevWord}`;
        try {
      const response = await axios.get(url);
      this.setState({ data: response.data }); // ✅ อัปเดต state หลังจากได้ response แล้ว
      console.log("Fetched Data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  handleKeyPress = (event) => {
    const { key } = event;

    if (/[a-zA-Z]/.test(key) && key.length === 1) {
      event.preventDefault();
      this.setState((prevState) => {
        const newRows = [...prevState.rows];
        const lastRowIndex = newRows.length - 1;
        const lastRow = [...newRows[lastRowIndex]]; // Copy last row to avoid mutation
        if (lastRow.length < prevState.wordlength) {
          lastRow.push(key.toUpperCase()); // Add character only once
          newRows[lastRowIndex] = lastRow; // Update the last row
        }
  
        return { rows: newRows };
      });
    } else if (key === "Backspace") {
      this.handleDelete();
    } else if (key === "Enter") {
      event.preventDefault();
      this.handleEnter(event);
    }
  };
  
  handleButtonClick = (char) => {
    // event.preventDefault();
    this.setState((prevState) => {
      const newRows = [...prevState.rows];
      const lastRowIndex = newRows.length - 1;
      const lastRow = [...newRows[lastRowIndex]]; // Copy last row to avoid mutation

      if (lastRow.length < prevState.wordlength) {
        lastRow.push(char.toUpperCase()); // Add character only once
        newRows[lastRowIndex] = lastRow; // Update the last row
      }

      return { rows: newRows };
    });
  };
  
  
  handleDelete = () => {
    this.setState((prevState) => {
      const newRows = [...prevState.rows];
      const lastRowIndex = newRows.length - 1;
      const lastRow = [...newRows[lastRowIndex]]; // Copy to avoid mutation
      
      if (lastRow.length > 0) {
        lastRow.pop(); // Remove only the last character
        newRows[lastRowIndex] = lastRow; // Update last row
      } else if (newRows.length > 1) {
        newRows.pop(); // Remove empty row if there’s more than one
      }
      
      return { rows: newRows };
    });
  };
  
  
  render() {
    const { heuristic } = this.props;
    const { rows } = this.state;
    console.log(this.state.rows)
    
    return (
      <div className="container">
        <div className="gameplay">
          {/* Start Word */}
          <div className="textarea startword">
            {heuristic.startword.split('').map((char, index) => (
              <textarea key={index} value={char.toUpperCase()} readOnly />
            ))}
          </div>

          {/* Dynamic Rows */}
          <div className="textarea input" ref={(el) => (this.scrollRef = el)}>
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {heuristic.startword.split('').map((_, charIndex) => (
                  <textarea
                    key={charIndex}
                    className={charIndex === 0 && rowIndex === 0 ? "block currentBlock" : "block"}
                    value={row[charIndex] || ""}
                    readOnly
                  />
                ))}
              </div>
            ))}
          </div>
          {/* End Word */}
          <div className="textarea endword">
            {heuristic.endword.split('').map((char, index) => (
              <textarea key={index} value={char.toUpperCase()} readOnly />
            ))}
          </div>
        </div>

        {/* Keyboard */}
        <div className="keyboard">
          <div className="keyboardRow">
            {'QWERTYUIOP'.split('').map((char) => (
              <button key={char} className="button characterButton" onClick={() => this.handleButtonClick(char)}>
                {char}
              </button>
            ))}
          </div>
          <div className="keyboardRow">
            <div className="keyboardSpacer"></div>
            {'ASDFGHJKL'.split('').map((char) => (
              <button key={char} className="button characterButton" onClick={() => this.handleButtonClick(char)}>
                {char}
              </button>
            ))}
            <div className="keyboardSpacer"></div>
          </div>
          <div className="keyboardRow">
            <button className="button enterButton" onClick={this.handleEnter}>
              Enter
            </button>

            {'ZXCVBNM'.split('').map((char) => (
              <button key={char} className="button characterButton" onClick={() => this.handleButtonClick(char)}>
                {char}
              </button>
            ))}
            <button className="button deleteButton" onClick={this.handleDelete}>
              <img src="https://static-00.iconduck.com/assets.00/backspace-icon-2048x1509-3pqr8k29.png" alt="-" />
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


//---------------------------------------------------------------------------


// let row = [];
// class Header extends Component {
  //   constructor(props) {
    //     super(props);
    //     this.state = {
      //       text: '', // Store textarea content
      //       startword: props.heuristic.startword, // ต้องใช้ props.heuristic
      //       endword: props.heuristic.endword,
      //       wordlength: props.heuristic.startword.length,
      
      //     };
      //     this.textAreaRef = createRef(); // สร้าง ref
      //   }
      
      //   //variable
      
      //   componentDidMount() {
        //     document.addEventListener('keydown', this.handleKeyPress);
        //   }
        
        //   componentWillUnmount() {
          //     document.removeEventListener('keydown', this.handleKeyPress);
          //   }
          
          //   handleKeyPress = (event) => {
            //     const { key } = event;
            
            //     if (key === 'Backspace') {
              //       this.handleDelete(); // Delete character when pressing Backspace
              //     }
              //     else if (key === 'Enter') {
                //       this.setState((prevState) => ({
                  //         text: prevState.text + '\n', // Add a new line
                  //       }));
                  //     }
                  //     else if (/[a-zA-Z]/.test(key)) {
                    //       // Allow only letters (A-Z, a-z)
                    //       this.setState((prevState) => ({
                      //         text: prevState.text + key.toUpperCase(), // Convert to uppercase
                      //       }));
//     }
//   };

//   handleButtonClick = (char) => {
  //     this.setState((prevState) => ({
    //       text: prevState.text + char,
    //     }));
    //   };
    
    //   handleDelete = () => {
      //     this.setState((prevState) => ({
        //       text: prevState.text.slice(0, -1), // Remove the last character
        //     }));
        //   };
        
        //   render() {
          //     // this.fetchData();
          //     const  {heuristic } = this.props; // ✅ รับ props มาใช้ใน render
          //     let textareas = []; // Create an empty array
          //     let row = '';
          //     // Use for loop to push textarea elements
          //     for (let i = 0; i < heuristic.startword.length; i++) {
            //       if (i === 0){
              //         textareas.push(<textarea className="block currentBlock"readOnly></textarea>);
              //       }
              //       else{
                //         textareas.push(<textarea className="block"readOnly></textarea>);
                //       }
//     }
//     row = <div class="row">{textareas}</div>


//     return (
  //       <div className="container">
  //         <div class="gameplay">
  //           <div className="textarea startword">      
  //             {heuristic.startword.split('').map((char) => (
    //               <textarea
    //                 value={char}
    //                 className=""
    //                 readOnly
    //               >
    //                 {char}
    //               </textarea>
    //             ))}      
    //           </div>
    //           <div className="textarea input">{row}{row}
    //           </div>
    //           {/* <div className="textarea input"> {row}</div> */}
    //           <div className="textarea endword">
    //             {heuristic.endword.split('').map((char) => (
      //                 <textarea
//                   value={char}
//                   className=""
//                   readOnly
//                 >
//                   {char}
//                 </textarea>
//               ))}            
//           </div>
//         </div>
//         <div className="keyboard">
//           <div className="keyboardRow">
//             {'QWERTYUIOP'.split('').map((char) => (
//               <button
//                 key={char}
//                 className="button characterButton"
//                 onClick={() => this.handleButtonClick(char)}
//               >
//                 {char}
//               </button>
//             ))}
//           </div>
//           <div className="keyboardRow">
//             <div className="keyboardSpacer"></div>
//             {'ASDFGHJKL'.split('').map((char) => (
  //               <button
  //                 key={char}
  //                 className="button characterButton"
  //                 onClick={() => this.handleButtonClick(char)}
  //               >
  //                 {char}
  //               </button>
  //             ))}
  //             <div className="keyboardSpacer"></div>
  //           </div>
  //           <div className="keyboardRow">
  //             <button className="button enterButton" onClick={() => this.handleButtonClick('\n')}>
  //               Enter
  //             </button>
  //             {'ZXCVBNM'.split('').map((char) => (
    //               <button
    //                 key={char}
    //                 className="button characterButton"
    //                 onClick={() => this.handleButtonClick(char)}
    //               >
    //                 {char}
    //               </button>
    //             ))}
    //             <button className="button deleteButton" onClick={this.handleDelete}>
    //               <img
    //                 src="https://static-00.iconduck.com/assets.00/backspace-icon-2048x1509-3pqr8k29.png"
    //                 alt="-"
    //               />
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   }
    
    //++++++++++++++++++++++++ work ++++++++++++++++++++++++++++++++++++++
      // handleKeyPress = (event) => {
      //   const { key } = event;
    
      //   if (key === 'Backspace') {
      //     this.handleDelete();
      //   } else if (key === 'Enter') {
      //     event.preventDefault(); // Prevent new line in input
      //     this.setState((prevState) => ({
      //       rows: [...prevState.rows, []], // Append a new row
      //     }));
      //   } else if (/[a-zA-Z]/.test(key)) {
      //     event.preventDefault();
      //     this.setState((prevState) => {
      //       const newRows = [...prevState.rows];
      //       const lastRow = newRows[newRows.length - 1];
    
      //       if (lastRow.length < prevState.wordlength) {
      //         lastRow.push(key.toUpperCase());
      //       }
    
      //       return { rows: newRows };
      //     });
      //   }
      // };
    
      // handleButtonClick = (char) => {
      //   this.setState((prevState) => {
      //     const newRows = [...prevState.rows];
      //     const lastRow = newRows[newRows.length - 1];
    
      //     if (lastRow.length < prevState.wordlength) {
      //       lastRow.push(char);
      //     }
    
      //     return { rows: newRows };
      //   });
      // };
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// }