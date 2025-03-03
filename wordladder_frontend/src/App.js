import './App.css';
import axios from 'axios'
import { Component, useState, useEffect } from 'react';


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
      filledRows: [], // เก็บ rowIndex ที่ต้องเปลี่ยนเป็น "filled"
      changedRows: [],
      confirmedRows: [],
    };
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

  ResetState = () => {
    this.setState({ rows: [[]] });
  }

  checkPrev = (row, rowLength) => {
    if (rowLength === 1) {
      return this.state.startword
    }
    else {
      return row[row.length - 2].join('').toLowerCase()
    }
  }

  handleEnter = (event) => {
    this.setState((prevState) => {
      const newRows = [...prevState.rows];
      const lastRowIndex = newRows.length - 1;
      const lastRow = newRows[lastRowIndex];
      const word = lastRow.join('').toLowerCase();
      const prevWord = this.checkPrev(newRows, newRows.length);

      if (lastRow.length === this.state.startword.length) {
        this.fetchData(word, prevWord);

        return {
          rows: [...newRows, []],
          filledRows: [...prevState.filledRows, lastRowIndex],
          confirmedRows: [...prevState.confirmedRows, lastRowIndex] // ✅ เพิ่ม rowIndex ที่ถูกตรวจสอบแล้ว
        };
      }
      return null;
    });
  };



  fetchData = async (word, prevWord) => {
    const url = `/check?word=${word}&previous=${prevWord}`;
    try {
      const response = await axios.get(url);
      const changeIndex = response.data.change;
      const prevRowIndex = this.state.rows.length - 2; // ✅ index ของ row ก่อนหน้า

      if (prevRowIndex >= 0) {
        this.setState((prevState) => ({
          data: response.data,
          changedRows: [
            ...prevState.changedRows,
            { rowIndex: prevRowIndex, charIndex: changeIndex }
          ]
        }));
      }
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
        lastRow.pop(); // ลบตัวอักษรสุดท้าย
        newRows[lastRowIndex] = lastRow;
      } else if (newRows.length > 1) {
        newRows.pop(); // ✅ ลบทั้งแถว (ถ้ามีมากกว่า 1 แถว)

        // ✅ ลบค่า changedRows ของ row ล่าสุดที่ถูกลบ
        const updatedChangedRows = prevState.changedRows.filter(
          (row) => row.rowIndex !== lastRowIndex - 1
        );

        return {
          rows: newRows,
          changedRows: updatedChangedRows
        };
      }

      return { rows: newRows };
    });
  };


  HandleCorrectBlock = (rowIndex, charIndex) => {
    if (!this.state.data || rowIndex === 0) {
      return false; // ถ้า rowIndex = 0 ไม่มีแถวก่อนหน้าให้เช็ค
    }

    const prevRow = this.state.rows[rowIndex - 1]; // ดึงแถวก่อนหน้า
    return (
      prevRow &&
      this.state.data.valid === true &&  // ต้องแน่ใจว่าผลลัพธ์ valid
      charIndex === this.state.data.change // ต้องตรงกับ index ที่เปลี่ยน
    );
  };



  render() {
    const { heuristic } = this.props;
    const { rows } = this.state;
    // const prevWord = this.state.rows[this.state.rows.length - 2].join('').toLowerCase();
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
                {
                  heuristic.startword.split('').map((_, charIndex) => {
                    console.log(`Row: ${rowIndex}, CharIndex: ${charIndex} , Char: ${row[charIndex]}`); // 🔹 ดูค่าของ charIndex และ rowIndex
                    return (
                      <textarea
                        key={charIndex}
                        className={`block 
                        ${(this.state.endword[charIndex].toUpperCase() === row[charIndex]) ? "correctBlock" : ""} 
                        ${this.state.changedRows.some(row => row.rowIndex === rowIndex && row.charIndex === charIndex) ? "transitionBlock" : ""}
                      `}
                        value={row[charIndex] || ""}
                        readOnly
                      />
                    )
                  })}
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

        {/* Pop-up Error */}

        {/* Reset Bttn */}
        <div class="Popup " onClick={this.ResetState}>{ }</div>


        {/* Reset Bttn */}
        <button class="clearBoardButton" onClick={this.ResetState}>Reset</button>

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
