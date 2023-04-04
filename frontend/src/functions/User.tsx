import React, {
  Component,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

export interface User {
  username: string;
  setUsername: (username: string) => void;
}

const UserContext = createContext<User>({
  username: "",
  setUsername: () => {},
});

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: any) => {
  const [username, setUsername] = useState("");
  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
