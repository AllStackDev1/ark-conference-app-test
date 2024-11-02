import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "src/utils/constant";

export const useSocketIO = (authorization: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(API_BASE_URL, {
        query: { authorization },
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to server:", socketRef.current?.id);
      });
    }

    // Clean up the socket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [authorization]);

  return socketRef.current
}