import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);

  // Cargar los datos del usuario desde localStorage cuando se monta el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('userWordle');
    if (storedUser) {
      setUserSession(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userSession, setUserSession }}>
      {children}
    </UserContext.Provider>
  );
};
