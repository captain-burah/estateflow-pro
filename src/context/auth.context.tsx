import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/auth.service'

interface AuthContextType {
  user: any | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        // Default role is 'agent', can be overridden with user metadata
        if (currentUser) {
          currentUser.role = currentUser.user_metadata?.role || 'agent'
        }
        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        user.role = user.user_metadata?.role || 'agent'
      }
      setUser(user)
    })

    return () => unsubscribe?.()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
