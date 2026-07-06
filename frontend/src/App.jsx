import { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import AuthPage from './components/AuthPage';

function App() {
  const [userName, setUserName] = useState(null);

  // Check karo agar pehle se login hai
  useEffect(() => {
    const token = localStorage.getItem('synbot_token');
    const name = localStorage.getItem('synbot_userName');
    if (token && name) {
      setUserName(name);
    }
  }, []);

  const handleLoginSuccess = (name) => {
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('synbot_token');
    localStorage.removeItem('synbot_userName');
    localStorage.removeItem('synbot_email');
    localStorage.removeItem('synbot_userId');
    setUserName(null);
  };

  if (!userName) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <ChatBox userName={userName} onLogout={handleLogout} />;
}

export default App;