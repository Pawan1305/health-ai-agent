import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import ChatPage from './pages/ChatPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
