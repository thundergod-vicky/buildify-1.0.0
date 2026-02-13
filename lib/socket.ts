import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (token: string) => {
  const socket = getSocket(token);
  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
