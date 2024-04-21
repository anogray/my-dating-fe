import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./UserContext.context";
import io, { Socket } from "socket.io-client";
// import { io, Socket } from 'socket.io-client';


let socketUrl = "http://192.168.1.10:4000";
const baseSocketError = { status: false, severity: "success", text: "" }

interface SocketContextType {
  globalSocket: Socket | null;
  setGlobalSocket: (socket: Socket | null) => void;
  globalError: { status: boolean; severity: string; text: string; };
  setGlobalError: React.Dispatch<React.SetStateAction<{ status: boolean; severity: string; text: string; }>>;
}


 const SocketContext = createContext<SocketContextType>({
  globalSocket: null,
  setGlobalSocket: (socket: Socket | null) => {},
  globalError: { status: false, severity: "success", text: "" },
  setGlobalError: (socketErr: any) => {}
});

 const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);
  const [globalError, setGlobalError] = useState<{ status: boolean; severity: string; text: string; }>({
    status: false,
    severity: "success",
    text: "",
  });
  const { isLoggedIn } = useContext(AuthContext);
  
  useEffect(() => {
    if (isLoggedIn) {
      const newSocket = io(socketUrl);
      console.log("socketioConnected")
      setGlobalSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isLoggedIn]);

  return (
    <SocketContext.Provider value={{ globalSocket, setGlobalSocket, globalError, setGlobalError }}>
      {children}
    </SocketContext.Provider>
  );
};

export  {SocketContext, SocketProvider}
