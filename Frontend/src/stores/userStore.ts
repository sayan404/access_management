import { atom } from 'nanostores'

export interface UserData {
  id: number
  username: string
  role: string
  token: string
}

export const userStore = atom<UserData | null>(null)

export const setUser = (userData: UserData | null) => {
  userStore.set(userData)
  
  // Also store in localStorage for persistence
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
  } else {
    localStorage.removeItem('userData')
  }
}

// Initialize store from localStorage if available
const savedUser = localStorage.getItem('userData')
if (savedUser) {
  try {
    setUser(JSON.parse(savedUser))
  } catch (e) {
    console.error('Failed to parse saved user data:', e)
    localStorage.removeItem('userData')
  }
} 