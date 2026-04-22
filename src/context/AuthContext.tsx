import { createContext, useContext, useState } from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  email: string
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  email: '',
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState(() => localStorage.getItem('email') ?? '')
  const isAuthenticated = email !== ''

  function login(email: string) {
    localStorage.setItem('email', email)
    setEmail(email)
  }

  function logout() {
    localStorage.removeItem('email')
    setEmail('')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
