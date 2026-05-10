import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Auth from "./Auth.jsx";

function App() {
  const token = localStorage.getItem("token");
  const [authToken, setAuthToken] = useState(token);

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);



  const bottomRef = useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [chat, loading]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHistory(res.data.chats || []);
      } catch (e) {
        // ignore if backend not ready
      }
    };

    if (token) loadHistory();
  }, [token]);



  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message: currentMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );


      const botMessage = {
        sender: "bot",
        text: res.data.reply,
      };

      setChat((prev) => [...prev, botMessage]);

    } catch (error) {

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "API Error",
        },
      ]);

    }

    setLoading(false);

  };

  const clearChat = () => {
    setChat([]);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setHistory([]);
    setChat([]);
    setSelectedChatId(null);
  };

  if (!authToken) {
    return <Auth onAuth={(t) => { setAuthToken(t); }} />;
  }


  return (

    <div className="app">


      {/* BACKGROUND */}

      <div className="bg-purple"></div>
      <div className="bg-blue"></div>

      {/* MAIN */}

      <div className="container">

        {/* SIDEBAR */}

        <div className="sidebar">

          <div>

            <h1 className="logo">
              AI Assistant
            </h1>

            <button
              className="new-chat-btn"
              onClick={clearChat}
            >
              + New Chat
            </button>

          </div>

          <div className="history">

            {history.length === 0 ? (
              <div className="history-item">
                AI Conversation
              </div>
            ) : (
              history.map((h) => (
                <div
                  key={h.id}
                  className="history-item"
                  onClick={() => {
                    setSelectedChatId(h.id);
                    setChat([
                      { sender: "user", text: h.userMessage },
                      { sender: "bot", text: h.botReply },
                    ]);
                  }}
                >
                  {(h.userMessage || "New chat").slice(0, 30)}
                </div>
              ))
            )}


          </div>


        </div>

        {/* CHAT AREA */}

        <div className="chat-container">

          {/* HEADER */}

          <div className="header">


            <div>

              <h2>
                MERN AI Chatbot
              </h2>

              <p>
                Powered by DeepSeek AI
              </p>

            </div>

            <div className="online"></div>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>


          {/* CHAT */}

        <div
  className="messages"
  id="messages"
>
            {chat.length === 0 && (

              <div className="welcome">

                <h1>
                  Welcome 👋
                </h1>

                <p>
                  Ask anything to your AI assistant
                </p>

              </div>

            )}

            {chat.map((msg, index) => (

              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={
                  msg.sender === "user"
                    ? "message user"
                    : "message bot"
                }
              >

                <div className="message-box">
                  {msg.text}
                </div>

              </motion.div>

            ))}

            {loading && (

              <div className="message bot">

                <div className="message-box">
                  AI is typing...
                </div>

              </div>

            )}

            <div ref={bottomRef}></div>

          </div>

          {/* INPUT */}

          <div className="input-section">

            <div className="input-box">

              <input
                type="text"
                placeholder="Send a message..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter" &&
                    !loading
                  ) {
                    sendMessage();
                  }

                }}
              />

              <button
                onClick={sendMessage}
              >
                {
                  loading
                    ? "..."
                    : "Send"
                }
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default App;