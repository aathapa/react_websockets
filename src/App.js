import React, { Component } from 'react';
import socketIO from 'socket.io-client';
import './App.css'

const socket = socketIO('http://localhost:3000');

class App extends Component {

  state = {
    messages: [],
    messageText: '',
    Id: ''
  }

  componentDidMount() {
    socket.on('socketId', Id => this.setState({ Id }));
    socket.on('newUser', newUserMessage => console.log(newUserMessage));
    socket.on('message', (newMessage) => {
      this.setState(({ messages }) => ({
        messages: [...messages, newMessage],
        id: newMessage.socketId
      }))
    })
  }

  onTextChange = e => {
    this.setState({ messageText: e.target.value })
  }

  onSendClick = e => {
    socket.emit('sendMessage', this.state.messageText);
    this.setState({ messageText: '' }, () => this._input.focus());
  }

  render() {
    const { messages, Id, messageText } = this.state;
    return (
      <div className="App-Container">
        <div className="App-Main-Section">
          <div className="App-Chat-Section">
            {messages.map(({ timestamp, data, socketId }) => {
              return (
                <div key={timestamp} style={{ margin: '15px' }}>
                  <span
                    className="App-Chat-Section-Item"
                    style={{ backgroundColor: socketId === Id ? '#0984e3' : '#d63031' }}
                  >
                    {data}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="App-Input-Section">
            <input
              ref={e => this._input = e}
              className="App-Input-Style"
              placeholder="Type your message"
              onChange={this.onTextChange}
              value={messageText}
              style={{ padding: 10 }}
            />
            <button
              className="App-Button-Style"
              disabled={messageText ? false : true}
              type="submit"
              onClick={this.onSendClick}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
