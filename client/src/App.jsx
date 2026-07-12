import { ChatProvider, useChat } from './context/ChatContext';
import LoginModal from './components/LoginModal';
import ChatWindow from './components/ChatWindow';

const AppContent = () => {
  const { isLoggedIn } = useChat();
  
  return isLoggedIn ? <ChatWindow /> : <LoginModal />;
};

function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}

export default App;
