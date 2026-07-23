import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://synbot-z87o.onrender.com';

function getUserId() {
  let userId = localStorage.getItem('synbot_userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('synbot_userId', userId);
  }
  return userId;
}

function newConversationId() {
  return 'conv_' + Math.random().toString(36).substr(2, 9);
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const FAQ_SUGGESTIONS = [
  '🏖️ Leave Policy',
  '🕐 Working Hours',
  '💰 Salary Date',
  '💻 IT Setup',
  '👔 Dress Code',
  '🪪 ID Card',
];

export default function ChatBox({ userName, onLogout }) {
  const userId = getUserId();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('synbot_darkMode') === 'true');
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hi ${userName}! 👋 I'm SynBot `,
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    loadConversations();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('synbot_darkMode', newMode);
  };

  const loadConversations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/conversations/${userId}`);
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const loadConversationMessages = async (convId) => {
    try {
      const res = await axios.get(`${API_URL}/api/conversations/${userId}/${convId}`);
      const msgs = [];
      res.data.forEach((entry) => {
        msgs.push({ sender: 'user', text: entry.message, time: new Date(entry.createdAt) });
        msgs.push({ sender: 'bot', text: entry.reply, time: new Date(entry.createdAt) });
      });
      setMessages(msgs);
      setActiveConvId(convId);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const startNewChat = () => {
    setActiveConvId(null);
    setMessages([
      {
        sender: 'bot',
        text: `Hi ${userName}! 👋 I'm SynBot — Synergy Labs HR & Onboarding Assistant. Ask me anything about leave policy, working hours, IT setup, or any HR-related query!`,
        time: new Date(),
      },
    ]);
    setInput('');
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    const convId = activeConvId || newConversationId();
    if (!activeConvId) setActiveConvId(convId);

    setMessages((prev) => [...prev, { sender: 'user', text: trimmed, time: new Date() }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: trimmed,
        userId,
        conversationId: convId,
      });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply, time: new Date() }]);
      loadConversations();
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Connection issue.', time: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const dm = darkMode;

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-300 ${dm ? 'bg-gray-950' : 'bg-slate-100'}`}>

      {/* SIDEBAR */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col ${dm ? 'bg-gray-900' : 'bg-indigo-900'}`}>

        <div className={`px-4 py-4 border-b ${dm ? 'border-gray-700' : 'border-indigo-700'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dm ? 'text-gray-400' : 'text-indigo-200'}`}>SynBot</p>
          <button
            onClick={startNewChat}
            className={`w-full flex items-center gap-2 text-white text-sm px-3 py-2 rounded-lg transition ${dm ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-700 hover:bg-indigo-600'}`}
          >
            <span className="text-lg">+</span> New Chat
          </button>
        </div>

        <div className={`px-4 py-3 border-b ${dm ? 'border-gray-700' : 'border-indigo-800'}`}>
          <p className={`text-xs ${dm ? 'text-gray-400' : 'text-indigo-300'}`}>Logged in as</p>
          <p className={`text-sm font-medium truncate ${dm ? 'text-gray-100' : 'text-white'}`}>👤 {userName}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {conversations.length === 0 && (
            <p className={`text-xs text-center mt-4 ${dm ? 'text-gray-500' : 'text-indigo-400'}`}>No conversations yet</p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.conversationId}
              onClick={() => loadConversationMessages(conv.conversationId)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition truncate ${
                activeConvId === conv.conversationId
                  ? dm ? 'bg-gray-600 text-white' : 'bg-indigo-600 text-white'
                  : dm ? 'text-gray-300 hover:bg-gray-700' : 'text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              💬 {conv.title}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${dm ? 'bg-gray-800 border-gray-700' : 'bg-indigo-700 border-indigo-600'}`}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-1.5 rounded-lg transition text-white ${dm ? 'hover:bg-gray-700' : 'hover:bg-indigo-600'}`}>
            ☰
          </button>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${dm ? 'bg-gray-600 text-white' : 'bg-white text-indigo-700'}`}>
            S
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">SynBot</h1>
          <p className={`text-xs ${dm ? 'text-gray-400' : 'text-indigo-200'}`}>AI Assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={toggleDarkMode} className={`text-lg p-1.5 rounded-lg transition ${dm ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-500'}`} title={dm ? 'Light Mode' : 'Dark Mode'}>
              {dm ? '☀️' : '🌙'}
            </button>
            <span className={`text-xs ${dm ? 'text-gray-300' : 'text-indigo-200'}`}>Hi, {userName}! 👋</span>
            <button onClick={onLogout} className={`text-xs text-white px-3 py-1.5 rounded-lg transition ${dm ? 'bg-gray-700 hover:bg-red-700' : 'bg-indigo-800 hover:bg-red-600'}`}>
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

          {/* FAQ Quick Buttons - only show on new chat */}
          {messages.length === 1 && (
            <div className="mb-2">
              <p className={`text-xs mb-2 text-center ${dm ? 'text-gray-400' : 'text-slate-500'}`}>Quick questions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {FAQ_SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      dm
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[75%]">
                <div
                  className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : dm
                      ? 'bg-gray-800 text-gray-100 rounded-bl-sm shadow-sm'
                      : 'bg-white text-slate-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Timestamp + Copy button */}
                <div className={`flex items-center gap-2 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`text-xs ${dm ? 'text-gray-500' : 'text-slate-400'}`}>
                    {formatTime(msg.time)}
                  </span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleCopy(msg.text, idx)}
                      className={`text-xs px-2 py-0.5 rounded transition ${
                        copiedIdx === idx
                          ? 'text-green-500'
                          : dm ? 'text-gray-500 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {copiedIdx === idx ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className={`flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm ${dm ? 'bg-gray-800' : 'bg-white'}`}>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className={`flex items-center gap-2 border-t px-3 py-3 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Apna sawal type karein..."
            className={`flex-1 rounded-full border px-4 py-2 text-sm outline-none transition ${
              dm
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-400'
                : 'border-slate-300 text-slate-800 focus:border-indigo-500'
            }`}
          />
          <button
            onClick={() => sendMessage()}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}