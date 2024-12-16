import React, { createContext, useContext } from 'react';

interface MockUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  clerk_id: string;
  bio: string;
}

interface MockAuthContextType {
  user: MockUser;
  isAuthenticated: boolean;
}

const mockUser: MockUser = {
  id: "23",
  email: "alexander_n_tran@brown.edu",
  username: "a",
  first_name: "Alexander",
  clerk_id: "user_2qDwZIAGzoJm5Z7h4yFD9fXYoAs",
  bio: "bla bla bla"
};

const MockAuthContext = createContext<MockAuthContextType>({
  user: mockUser,
  isAuthenticated: true
});

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockAuthContext.Provider value={{ user: mockUser, isAuthenticated: true }}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => useContext(MockAuthContext); 