import { useCurrentUserQuery, useVerifyTokenQuery } from "@/redux/auth";
import { ICurrentUser } from "@/types/user.types";
import React from "react";

interface InitialContextType {
  isLoading: boolean;
  user: ICurrentUser | null;
  isLoggedIn: boolean;
}

const initialContext: InitialContextType = {
  isLoading: true,
  user: null,
  isLoggedIn: false,
};

const AuthContext = React.createContext<InitialContextType>(initialContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] =
    React.useState<InitialContextType>(initialContext);

  // ✅ CHECK TOKEN FIRST
  const token = localStorage.getItem("token");

  // ✅ ONLY CALL API IF TOKEN EXISTS
  const { isError } = useVerifyTokenQuery(undefined, {
    skip: !token,
  });

  const { data, isLoading } = useCurrentUserQuery(undefined, {
    skip: !token,
  });

  React.useEffect(() => {
    // ✅ if no token → user is logged out
    if (!token) {
      setAuthState({
        user: null,
        isLoading: false,
        isLoggedIn: false,
      });
      return;
    }

    if (!isLoading) {
      setAuthState({
        user: data ?? null,
        isLoading,
        isLoggedIn: !isError,
      });
    }
  }, [data, isError, isLoading, token]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };