import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [isSpecialUserCtx, setIsSpecialUserCtx] = useState()

  return (
    <AuthContext.Provider value = {{ isSpecialUserCtx, setIsSpecialUserCtx }}>
        {children}
    </AuthContext.Provider>
)
}

