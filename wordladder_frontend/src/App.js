import "./App.css";
import axios from "axios";
import { Component, useState, useEffect ,useRef} from "react";

// ------------------- work version ------------------------------------

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      text: "",
      errorStatus:false,
      winningStatus:false,
      startword: props.heuristic.startword, // Props for heuristic
      endword: props.heuristic.endword,
      wordlength: props.heuristic.startword.length,
      rows: [[]], // Store multiple rows of textareas
      filledRows: [], // เก็บ rowIndex ที่ต้องเปลี่ยนเป็น "filled"
      changedRows: [],
      confirmedRows: [],
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.heuristic.startword !== this.props.heuristic.startword) {
      this.setState({
        startword: this.props.heuristic.startword,
        endword: this.props.heuristic.endword,
      });
    }
    if (this.scrollRef) {
      this.scrollRef.scrollTop = this.scrollRef.scrollHeight; // เลื่อนลงสุด
    }
  }

  ResetState = () => {
    this.setState({
      rows: [[]],
      filledRows: [],
      changedRows: [],
      confirmedRows: [],
      endword: this.props.heuristic.endword,
      startword: this.props.heuristic.startword,
      data: null,
      wordlength: this.props.heuristic.startword.length,
      errorStatus:false,
      winningStatus:false,
    });
  };

  checkPrev = (row, rowLength) => {
    if (rowLength === 1) {
      return this.state.startword;
    } else {
      return row[row.length - 2].join("").toLowerCase();
    }
  };

  handleEnter = async (event) => {
    const { rows } = this.state;
    const newRows = [...rows];
    const lastRowIndex = newRows.length - 1;
    const lastRow = newRows[lastRowIndex];
    const prevWord = this.checkPrev(newRows, newRows.length);
    const word = lastRow.join("").toLowerCase();
    if (lastRow.length === this.state.startword.length) {
      try {
        const data = await this.fetchData(word, prevWord);
        console.log(data);
        if (data && data.valid) {
          this.setState((prevState) => {
            if ((word.toLowerCase() === this.state.endword.toLowerCase()) && data.valid){
             this.setState({winningStatus:true})
             this.props.onWin(true, this.state.rows.length);
             setTimeout(() => {
               this.setState({ winningStatus: true });
             }, 3000);
            }else {
              return {
              rows: [...newRows, []],
              filledRows: [...prevState.filledRows, lastRowIndex],
              confirmedRows: [...prevState.confirmedRows, lastRowIndex],
            };}
          });
         
         } else {

          this.setState({errorStatus:true});
          setTimeout(() => {
            this.setState({ errorStatus: false });
          }, 3000);
        }
      } catch {}
      return null;
    }
  };

  fetchData = async (word, prevWord) => {
    const url = `/check?word=${word}&previous=${prevWord}`;
    try {
      const response = await axios.get(url);
      const changeIndex = response.data.change;
      const prevRowIndex = this.state.rows.length - 1;

      if (prevRowIndex >= 0) {
        this.setState((prevState) => ({
          data: response.data,
          changedRows: [
            ...prevState.changedRows,
            { rowIndex: prevRowIndex, charIndex: changeIndex },
          ],
        }));
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  handleKeyPress = (event) => {
    const { key } = event;

    // 🔥 ป้องกันทุกการกดแป้นพิมพ์ถ้าเกมจบแล้ว
    if (this.state.winningStatus) {
      return;
    }

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
      event.preventDefault(); // 🔥 ป้องกันการลบ ถ้าเกมจบแล้ว
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
    if (this.state.winningStatus) {
      return; // ป้องกันการพิมพ์หรือลบเมื่อชนะแล้ว
    }else{

      this.setState((prevState) => {
        const newRows = [...prevState.rows];
        const lastRowIndex = newRows.length - 1;
        const lastRow = [...newRows[lastRowIndex]]; // Copy to avoid mutation
  
        if (lastRow.length > 0) {
          lastRow.pop(); // ลบตัวอักษรสุดท้าย
          newRows[lastRowIndex] = lastRow;
        } else if (newRows.length > 1) {
          newRows.pop();
  
          const updatedChangedRows = prevState.changedRows.filter(
            (row) => row.rowIndex !== lastRowIndex - 1
          );
  
          return {
            rows: newRows,
            changedRows: updatedChangedRows,
          };
        }
  
        return { rows: newRows };
      });
    }
  };

  HandleCorrectBlock = (rowIndex, charIndex) => {
    if (!this.state.data || rowIndex === 0) {
      return false; // ถ้า rowIndex = 0 ไม่มีแถวก่อนหน้าให้เช็ค
    }

    const prevRow = this.state.rows[rowIndex - 1]; // ดึงแถวก่อนหน้า
    return (
      prevRow &&
      this.state.data.valid === true && // ต้องแน่ใจว่าผลลัพธ์ valid
      charIndex === this.state.data.change // ต้องตรงกับ index ที่เปลี่ยน
    );
  };

  generateRandomNumber = () => {
    const randomValue = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
    
    // ✅ ตรวจสอบว่ามี sendRandomNumber ใน props หรือไม่ ก่อนเรียกใช้
    if (this.props.sendRandomNumber) {
      console.log(`RandomNumber : ${randomValue}`)
      this.props.sendRandomNumber(randomValue);
    } else {
      console.error("sendRandomNumber is not provided!");
    }
  };

  render() {
    const { heuristic } = this.props;
    const { rows } = this.state;
    console.log("Row Before Random:", rows);

    // const prevWord = this.state.rows[this.state.rows.length - 2].join('').toLowerCase();
    // console.log(this.state.rows);
    if (!this.props.heuristic || !this.props.heuristic.startword || !this.props.heuristic.endword) {
      return <div>Loading...</div>; // ป้องกัน error โดยไม่ render ถ้ายังไม่มีข้อมูล
    }
    return (
      <div className="container">
        <div className="gameplay">
          {/* Start Word */}
          <div className="textarea startword">
            {heuristic.startword.split("").map((char, index) => (
              <textarea key={index} value={char.toUpperCase()} readOnly />
            ))}
          </div>

          {/* Dynamic Rows */}
          <div className="textarea input" ref={(el) => (this.scrollRef = el)}>
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {heuristic.startword.split("").map((_, charIndex) => {
                  console.log(
                    `Row: ${rowIndex}, CharIndex: ${charIndex} , Char: ${row[charIndex]}`
                  ); // 🔹 ดูค่าของ charIndex และ rowIndex
                  return (
                    <textarea
                      key={charIndex}
                      className={`block 
                        ${
                          this.props.heuristic.endword[charIndex].toUpperCase() ===
                          row[charIndex]
                            ? "correctBlock"
                            : ""
                        } 
                        ${
                          this.state.changedRows.some(
                            (row) =>
                              row.rowIndex === rowIndex &&
                              row.charIndex === charIndex
                          )
                            ? "transitionBlock"
                            : ""
                        }
                      `}
                      value={row[charIndex] || ""}
                      readOnly
                    />
                  );
                })}
              </div>
            ))}
          </div>
                <div className="textarea endword">
          {heuristic.endword.split("").map((char, index) => {
            // ดึงแถวล่าสุดที่ถูกยืนยัน
            const lastConfirmedRowIndex = this.state.confirmedRows.length > 0 
              ? this.state.confirmedRows[this.state.confirmedRows.length - 1] 
              : null;
            
            const lastConfirmedRow = lastConfirmedRowIndex !== null 
              ? this.state.rows[lastConfirmedRowIndex] 
              : [];

            // เช็กว่าตัวอักษรตรงกับ endword หรือไม่
            const isCorrect = lastConfirmedRow.length === heuristic.endword.length &&
                              lastConfirmedRow[index]?.toUpperCase() === char.toUpperCase();

            return (
              <textarea
                key={index}
                value={char?.toUpperCase()}
                className={isCorrect || this.state.winningStatus ? "correctBlock" : ""}
                readOnly
              />
            );
          })}
        </div>



        {/* Pop-up*/}
        {this.state.errorStatus ? (
          <div className="Message error">{this.state.data.message}</div>
        ) : (
          null
        )}
        </div>
        {this.state.winningStatus?(
          <div className="Message win">You Win!!!</div>
        ):(
          null
        )}

        {/* Reset Bttn */}
        <button class="clearBoardButton" onClick={this.ResetState}>
          Reset
        </button>

        {/* Keyboard */}
        <div className="keyboard">
          <div className="keyboardRow">
            {"QWERTYUIOP".split("").map((char) => (
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
            {"ASDFGHJKL".split("").map((char) => (
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
            <button className="button enterButton" onClick={this.handleEnter}>
              Enter
            </button>

            {"ZXCVBNM".split("").map((char) => (
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

// function App() {
//   const [data, setData] = useState(null);
//   const [winningStatus, setWinningStatus] = useState(false);
//   const [score, setScore] = useState(0);

//   useEffect(() => {
//     fetchData(3); // ค่าเริ่มต้น
//   }, []);

//   // ฟังก์ชันที่ parent จะเรียกใช้
//   const resetChild = () => {
//     if (childRef.current) {
//       childRef.current.ResetState();  // เรียกฟังก์ชันใน child component
//     }
//   };

//   const fetchData = async (length) => {
//     try {
//       const response = await axios.get(`/game?length=${length}&blind=bfs&heuristic=astar`);
//       setData(response.data);
//       setWinningStatus(false);
//       setScore(0);
//       console.log("Fetched Data:", response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const childRef = useRef(null);  // ใช้ ref เพื่อเข้าถึง child component


//   return (
//     <div className="app-container">
//       {data?.heuristic && (
//         <Header ref={childRef}
//           heuristic={data.heuristic}
//           onWin={(status, rows) => {
//             setWinningStatus(status);
//             setScore(rows);
//           }}
//         />
//       )}

//       {winningStatus && (
//         <div className="popup-overlay">
//           <div className="popup">
//             <h2>Statistics</h2>
//             <div className="stats">
//               <div className="stat-block">
//                 <div className="stat-number">{score}</div>
//                 <div className="stat-label">Score</div>
//               </div>
//               <div className="stat-block">
//                 <div className="stat-number">{data.heuristic?.optimal || 0}</div>
//                 <div className="stat-label">Optimal</div>
//               </div>
//             </div>
//             <button className="random-button" onClick={() => {
//               resetChild()
//               fetchData(Math.floor(Math.random() * 4) + 3)
//               }}>
//               Random
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function App() {
//   const [data, setData] = useState(null);
//   const [winningStatus, setWinningStatus] = useState(false);
//   const [score, setScore] = useState(0);
//   const [loading, setLoading] = useState(false);  // Add loading state

//   useEffect(() => {
//     fetchData(3); // Initial fetch with default length
//   }, []);

//   const resetChild = () => {
//     if (childRef.current) {
//       childRef.current.ResetState();  // Reset child component
//     }
//   };

//   const fetchData = async (length) => {
//     setLoading(true);  // Set loading to true when fetch starts
//     try {
//       const response = await axios.get(`/game?length=${length}&blind=bfs&heuristic=astar`);
//       setData(response.data);
//       setWinningStatus(false);
//       setScore(0);
//       console.log("Fetched Data:", response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);  // Set loading to false once data is fetched or on error
//     }
//   };

//   const childRef = useRef(null);  // Use ref to access child component

//   return (
//     <div className="app-container">
//       {loading ? (  // Show loading spinner if data is being fetched
//         <div className="loading-spinner">Loading...</div>
//       ) : (
//         data?.heuristic && (
//           <Header ref={childRef}
//             heuristic={data.heuristic}
//             onWin={(status, rows) => {
//               setWinningStatus(status);
//               setScore(rows);
//             }}
//           />
//         )
//       )}

//       {winningStatus && (
//         <div className="popup-overlay">
//           <div className="popup">
//             <h2>Statistics</h2>
//             <div className="stats">
//               <div className="stat-block">
//                 <div className="stat-number">{score}</div>
//                 <div className="stat-label">Score</div>
//               </div>
//               <div className="stat-block">
//                 <div className="stat-number">{data.heuristic?.optimal || 0}</div>
//                 <div className="stat-label">Optimal</div>
//               </div>
//             </div>
//             <button className="random-button" onClick={() => {
//               resetChild();
//               fetchData(Math.floor(Math.random() * 4) + 3);
//             }}>
//               Random
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

function App() {
  const [data, setData] = useState(null);
  const [winningStatus, setWinningStatus] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);  // Add loading state

  useEffect(() => {
    fetchData(3); // Initial fetch with default length
  }, []);

  const resetChild = () => {
    if (childRef.current) {
      childRef.current.ResetState();  // Reset child component
    }
  };

  const fetchData = async (length) => {
    setLoading(true);  // Set loading to true when fetch starts
    try {
      const response = await axios.get(`/game?length=${length}&blind=bfs&heuristic=astar`);
      setData(response.data);
      setWinningStatus(false);
      setScore(0);
      console.log("Fetched Data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);  // Set loading to false once data is fetched or on error
    }
  };

  const childRef = useRef(null);  // Use ref to access child component

  return (
    <div className="app-container">
      {loading ? (  // Show loading spinner if data is being fetched
        <div className="loading-spinner">Loading...</div>
      ) : (
        data?.heuristic && (
          <Header ref={childRef}
            heuristic={data.heuristic}
            onWin={(status, rows) => {
              setWinningStatus(status);
              setScore(rows);
            }}
          />
        )
      )}

      {/* Only show pop-up if not loading and winningStatus is true */}
      {!loading && winningStatus && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Statistics</h2>
            <div className="stats">
              <div className="stat-block">
                <div className="stat-number">{score}</div>
                <div className="stat-label">Score</div>
              </div>
              <div className="stat-block">
                <div className="stat-number">{data.heuristic?.optimal || 0}</div>
                <div className="stat-label">Optimal</div>
              </div>
            </div>
            <button className="random-button" onClick={() => {
              resetChild();
              fetchData(Math.floor(Math.random() * 4) + 3);
            }}>
              Random
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;
