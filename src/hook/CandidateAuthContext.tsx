import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

type CandidateUser = {
  id: number;
  email: string;
  academic_id: number;
};

type AuthContextType = {
  candidateUser: CandidateUser | null;
  candidateToken: string | null;
  login: (user: CandidateUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const CandidateAuthContext = createContext<AuthContextType | null>(null);

export const CandidateAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'candidateUser',
    'candidateToken',
  ]);

  const [candidateUser, setCandidateUser] = useState<CandidateUser | null>(null);
  const [candidateToken, setCandidateToken] = useState<string | null>(null);

  // 🔄 On refresh – restore from cookies
  useEffect(() => {
    if (cookies.candidateUser && cookies.candidateToken) {
      setCandidateUser(cookies.candidateUser);
      setCandidateToken(cookies.candidateToken);
    }
  }, [cookies]);

  const login = (user: CandidateUser, token: string) => {
    setCandidateUser(user);
    setCandidateToken(token);

    // 🍪 Store in cookies
    setCookie('candidateUser', user, {
      path: '/',
      sameSite: 'lax',
    });

    setCookie('candidateToken', token, {
      path: '/',
      sameSite: 'lax',
    });
  };

  const logout = () => {
    setCandidateUser(null);
    setCandidateToken(null);

    removeCookie('candidateUser', { path: '/' });
    removeCookie('candidateToken', { path: '/' });
  };

  return (
    <CandidateAuthContext.Provider
      value={{
        candidateUser,
        candidateToken,
        login,
        logout,
        isAuthenticated: !!candidateToken,
      }}
    >
      {children}
    </CandidateAuthContext.Provider>
  );
};

export const useCandidateAuth = () => {
  const context = useContext(CandidateAuthContext);
  if (!context) {
    throw new Error('useCandidateAuth must be used inside CandidateAuthProvider');
  }
  return context;
};
