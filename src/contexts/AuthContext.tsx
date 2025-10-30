import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  name: string;
  aadhaarId: string;
  abhaId: string;
  avatarUrl: string;
  contact: string;
  email: string;
  dob: string;
  familyMembers: {
    name: string;
    relation: string;
    abhaId: string;
    avatarUrl: string;
  }[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userType: 'citizen' | 'provider') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockCitizenUser: User = {
  name: "Yasser Ahmed",
  aadhaarId: "XXXX-XXXX-5678",
  abhaId: "21-4365-8790-5432",
  avatarUrl: "https://ui.shadcn.com/avatars/01.png",
  contact: "+91 98765 43210",
  email: "ananya.sharma@email.com",
  dob: "25 Oct 1992",
  familyMembers: [
    {
      name: "Rohan Sharma",
      relation: "Husband",
      abhaId: "25-9876-5432-1098",
      avatarUrl: "https://ui.shadcn.com/avatars/02.png",
    }
  ]
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedUser = localStorage.getItem('user');
      if (storedAuth === 'true' && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userType: 'citizen' | 'provider') => {
    // In a real app, you'd fetch this data from an API
    const userData = userType === 'citizen' ? mockCitizenUser : null; // Placeholder for provider
    
    if (userData) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
