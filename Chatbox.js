import React, { useState } from 'react';
import './Chatbox.css';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Call ChatGPT API to get bot response
    await getChatGPTResponse(inputValue);
  };

  const getChatGPTResponse = async (userInput) => {
    const data = JSON.stringify({
      messages: [
        {
          role: 'user',
          content: userInput
        }
      ],
      system_prompt: '',
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false
    });

    try {
      const response = await fetch('https://chatgpt-42.p.rapidapi.com/conversationgpt4-2', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '98a7d3592fmsh005053e62a969d8p1c6043jsn42114a79f26a',
          'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        const botMessage = { sender: 'bot', text: result?.choices?.[0]?.message?.content || 'Sorry, I could not understand.' };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = { sender: 'bot', text: 'Error getting response from ChatGPT API' };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = { sender: 'bot', text: `Failed to fetch response: ${error.message}` };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const toggleChatbox = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="chat-container">
      <button onClick={toggleChatbox} className="chat-btn">
        {isVisible ? 'Close Chat' : 'Chat with us'}
      </button>
      {isVisible && (
        <div className="chatbox">
          <div className="chatbox-header">
            <h2>TravelBuddy Chat</h2>
          </div>
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form className="chatbox-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
