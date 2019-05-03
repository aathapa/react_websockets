import React, { useState, useEffect } from 'react';
import socketIO from 'socket.io-client';
import './App.css'

const socket = socketIO('http://localhost:4000');

function App() {
  let textInputRef = React.createRef();
  const [messages, setMessages] = useState([]);
  const [Id, setId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    socket.on('socketId', Id => setId(Id));
    socket.on('newUser', newUserMessage => console.log(newUserMessage));
    socket.on('message', (newMessage) => setMessages(prevMessage => [...prevMessage, newMessage]));
    socket.on('location', location => setLocation(location));
  }, []);

  const onTextChange = e => {
    setMessageText(e.target.value);
  }

  const onSendClick = e => {
    socket.emit('sendMessage', messageText);
    setMessageText('');
    textInputRef.current.focus();
  }

  const onSendLocationClick = () => {
    navigator.geolocation
      .getCurrentPosition(({ coords: { latitude, longitude } }) =>
        socket.emit('sendLocation', { latitude, longitude })
    );
  }

  console.log(messages);
  return (
    <div className="App-Container">
      <div className="App-Main-Section">
        <div className="App-Chat-Section">
          {messages.map(({ createdAt, messageText, socketId }) => {
            return (
              <div key={createdAt} style={{ margin: '15px' }}>
                <span
                  className="App-Chat-Section-Item"
                  style={{ backgroundColor: socketId === Id ? '#0984e3' : '#d63031' }}
                >
                  {messageText}
                </span>
              </div>
            )
          })}
          <span>
            {location && <a href={location} rel="noopener noreferrer" target="_blank">My Location</a>}
          </span>
        </div>
        <div className="App-Input-Section">
          <input
            ref={textInputRef}
            className="App-Input-Style"
            placeholder="Type your message"
            onChange={onTextChange}
            value={messageText}
            style={{ padding: 10 }}
          />
          <button
            type="submit"
            onClick={onSendLocationClick}
          >
            Send Location
          </button>
          <button
            className="App-Button-Style"
            disabled={messageText ? false : true}
            type="submit"
            onClick={onSendClick}
          >
            Send
            </button>
        </div>
      </div>
    </div>
  );
}

export default App;
