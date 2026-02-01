import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserCredential {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  isAdmin: boolean; // True for admin/editor, False for guest viewers
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { email: string; phone: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, phone: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash function for password (in production, use bcrypt or similar on backend)
const hashPassword = (password: string): string => {
  return btoa(password); // Base64 encoding - NOT secure, for demo only
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Initialize default users in localStorage if not exists
const initializeDefaultUsers = () => {
  if (!localStorage.getItem("users")) {
    const defaultUsers: UserCredential[] = [
      {
        id: "1",
        email: "admin@topperformers.com",
        phone: "+8801700000000",
        passwordHash: hashPassword("admin123"),
        isAdmin: true, // Can manage leaderboard and app config
      },
    ];
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ email: string; phone: string } | null>(null);

  // Initialize and check if user is already logged in on mount
  useEffect(() => {
    initializeDefaultUsers();

    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setIsAdmin(authData.isAdmin);
        setUser(authData.user);
      } catch (error) {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const signup = async (email: string, phone: string, password: string, isAdmin: boolean = false) => {
    // Validation
    if (!email || !phone || !password) {
      throw new Error("All fields are required");
    }

    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Validate Bangladesh phone number
    const bdPhoneRegex = /^(\+880|880|0)1[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone.replace(/\s/g, ""))) {
      throw new Error("Invalid Bangladesh phone number. Use format: +8801XXXXXXXXX or 01XXXXXXXXX");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]") as UserCredential[];
    if (users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }

    if (users.some((u) => u.phone === phone)) {
      throw new Error("Phone number already registered");
    }

    // Create new user
    const newUser: UserCredential = {
      id: Date.now().toString(),
      email,
      phone: phone.replace(/\s/g, ""), // Normalize phone
      passwordHash: hashPassword(password),
      isAdmin: isAdmin, // Default to guest (isAdmin = false)
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Auto-login after signup
    const userData = { email: newUser.email, phone: newUser.phone };
    setIsAuthenticated(true);
    setIsAdmin(newUser.isAdmin);
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify({ user: userData, isAdmin: newUser.isAdmin }));
  };

  const login = async (email: string, password: string) => {
    // Validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check against stored users
    const users = JSON.parse(localStorage.getItem("users") || "[]") as UserCredential[];
    const foundUser = users.find((u) => u.email === email);

    if (!foundUser || !verifyPassword(password, foundUser.passwordHash)) {
      throw new Error("Invalid credentials");
    }

    const userData = { email: foundUser.email, phone: foundUser.phone };
    setIsAuthenticated(true);
    setIsAdmin(foundUser.isAdmin);
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify({ user: userData, isAdmin: foundUser.isAdmin }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
