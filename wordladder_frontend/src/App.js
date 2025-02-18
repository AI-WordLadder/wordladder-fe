import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <div class="container">
        <div class="textarea">
          <textarea></textarea>
        </div>
        <div class="keyboard">
        <div class="keyboardRow">
          <button class="button characterButton">q</button>
          <button class="button characterButton">w</button>
          <button class="button characterButton">e</button>
          <button class="button characterButton">r</button>
          <button class="button characterButton">t</button>
          <button class="button characterButton">y</button>
          <button class="button characterButton">u</button>
          <button class="button characterButton">i</button>
          <button class="button characterButton">o</button>
          <button class="button characterButton">p</button>
          </div>
          <div class="keyboardRow">
            <div class="keyboardSpacer">
          </div>
          <button class="button characterButton">a</button>
          <button class="button characterButton">s</button>
          <button class="button characterButton">d</button>
          <button class="button characterButton">f</button>
          <button class="button characterButton">g</button>
          <button class="button characterButton">h</button>
          <button class="button characterButton">j</button>
          <button class="button characterButton">k</button>
          <button class="button characterButton">l</button>
          <div class="keyboardSpacer"></div>
          </div>
          <div class="keyboardRow">
            <button class="button enterButton">Enter</button>
            <button class="button characterButton">z</button>
            <button class="button characterButton">x</button>
            <button class="button characterButton">c</button>
            <button class="button characterButton">v</button>
            <button class="button characterButton">b</button>
            <button class="button characterButton">n</button>
            <button class="button characterButton">m</button>
            <button class="button deleteButton">
            <img src="https://static-00.iconduck.com/assets.00/backspace-icon-2048x1509-3pqr8k29.png" alt="Button Image"></img>           
        <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
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
      <Header></Header>
    </div>
  );
}

export default App;
