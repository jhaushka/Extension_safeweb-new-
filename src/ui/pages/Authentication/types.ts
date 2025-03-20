export interface UserData {
  email: string
  password: string
  profilePic?: File | null
}

export interface SignUpProps {
  onSignUp: (userData: UserData) => void
}

export interface LoginProps {
  onLogin: (userData: Omit<UserData, "profilePic">) => void
}
