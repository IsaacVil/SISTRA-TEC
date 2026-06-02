import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'transportista';

export interface User {
  id: string;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  rol: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    nombreCompleto: string;
    correoElectronico: string;
    telefono: string;
    contraseña: string;
    rol: UserRole;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sistra-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const register = async (userData: {
    nombreCompleto: string;
    correoElectronico: string;
    telefono: string;
    contraseña: string;
    rol: UserRole;
  }): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('sistra-users') || '[]');

      const existingUser = users.find(
        (u: any) => u.correoElectronico === userData.correoElectronico
      );

      if (existingUser) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        nombreCompleto: userData.nombreCompleto,
        correoElectronico: userData.correoElectronico,
        telefono: userData.telefono,
        rol: userData.rol,
        contraseña: userData.contraseña,
      };

      users.push(newUser);
      localStorage.setItem('sistra-users', JSON.stringify(users));

      const { contraseña, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('sistra-user', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('sistra-users') || '[]');
      const foundUser = users.find(
        (u: any) => u.correoElectronico === email && u.contraseña === password
      );

      if (foundUser) {
        const { contraseña, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('sistra-user', JSON.stringify(userWithoutPassword));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sistra-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
