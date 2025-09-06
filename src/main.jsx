import { createContext, StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

export const Context = createContext({ isAuthenticated: false, loading: true });

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  return (
    <Context.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser, loading, setLoading }}
    >
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
