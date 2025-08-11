import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for existing session on app start
  useEffect(() => {
    checkAuthSession();
  }, []);

  const checkAuthSession = () => {
    try {
      const session = localStorage.getItem('auth_session');
      const userInfo = localStorage.getItem('user_info');
      
      if (session && userInfo) {
        const sessionData = JSON.parse(session);
        const userData = JSON.parse(userInfo);
        
        // Check if session is still valid (not expired)
        if (sessionData.expires && new Date().getTime() < sessionData.expires) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // Session expired, clear it
          clearSession();
        }
      }
    } catch (error) {
      console.error('Error checking auth session:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData = null) => {
    try {
      const sessionData = {
        loginTime: new Date().getTime(),
        expires: new Date().getTime() + (24 * 60 * 60 * 1000), // 24 hours
        sessionId: generateSessionId()
      };

      const defaultUser = {
        username: 'charoenlap',
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      const user = userData || defaultUser;

      localStorage.setItem('auth_session', JSON.stringify(sessionData));
      localStorage.setItem('user_info', JSON.stringify(user));

      setIsAuthenticated(true);
      setUser(user);
      
      console.log('Login successful, session created');
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const logout = () => {
    clearSession();
    setIsAuthenticated(false);
    setUser(null);
    console.log('Logout successful, session cleared');
  };

  const clearSession = () => {
    localStorage.removeItem('auth_session');
    localStorage.removeItem('user_info');
  };

  const updateLastActivity = () => {
    try {
      if (isAuthenticated && user) {
        const updatedUser = {
          ...user,
          lastActivity: new Date().toISOString()
        };
        localStorage.setItem('user_info', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  };

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    updateLastActivity,
    checkAuthSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
