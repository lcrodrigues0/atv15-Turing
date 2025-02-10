import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [isSpecialUserCtx, setIsSpecialUser] = useState()

  function setIsSpecialUserCtx(isSpecialUser) {
    setIsSpecialUser(isSpecialUser)
    sessionStorage.setItem('isSpecialUser', isSpecialUser)
  }

  return (
    <AuthContext.Provider value = {{ isSpecialUserCtx, setIsSpecialUserCtx }}>
        {children}
    </AuthContext.Provider>
)
}

